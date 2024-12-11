// src/services/influxservice.js
import { InfluxDB } from '@influxdata/influxdb-client';

const url = process.env.REACT_APP_INFLUX_URL;
const token = process.env.REACT_APP_INFLUX_TOKEN;
const org = process.env.REACT_APP_INFLUX_ORG;
const bucket = process.env.REACT_APP_INFLUX_BUCKET;

// Second database connection
const url2 = 'http://34.176.110.145:8086/';
const token2 = 'HuVx0CJwF1invhkaNTfHu0HnGIpCdrD40lBI1MAx6x579CE2CGtOhykCZh1CwVXsj6ftBywnqVwa3SWk6jYOMA==';
const org2 = 'iot';
const bucket2 = 'Prueba';

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
const queryApi2 = new InfluxDB({ url: url2, token: token2 }).getQueryApi(org2);

// Function to fetch fields from second database
const fetchFields = async () => {
  const query = `
    from(bucket: "${bucket2}")
      |> range(start: -16h)
      |> group()
      |> distinct(column: "_field")
  `;

  return new Promise((resolve, reject) => {
    const fields = [];
    queryApi2.queryRows(query, {
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        fields.push(o._value);
      },
      error: (error) => {
        console.error(error);
        reject(error);
      },
      complete: () => {
        resolve(fields);
      },
    });
  });
};

// Modified fetchMeasurements to combine both sources
export const fetchMeasurements = async () => {
  const query = `
    import "influxdata/influxdb/schema"
    schema.measurements(bucket: "${bucket}")
  `;

  try {
    const [measurements, fields] = await Promise.all([
      new Promise((resolve, reject) => {
        const measurements = [];
        queryApi.queryRows(query, {
          next: (row, tableMeta) => {
            const o = tableMeta.toObject(row);
            measurements.push({ label: o._value, source: 'url' });
          },
          error: (error) => reject(error),
          complete: () => resolve(measurements),
        });
      }),
      fetchFields().then(fields => fields.map(field => ({ label: field, source: 'url2' })))
    ]);

    // Combine both arrays without removing duplicates
    const combined = [...measurements, ...fields];

    return combined;
  } catch (error) {
    console.error('Error fetching measurements:', error);
    throw error;
  }
};

// Modified fetchData to handle both measurement and field queries
export const fetchData = async (measurementOrField) => {
  // Try first database
  const query1 = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "${measurementOrField}")
      |> last()
  `;

  // Try second database
  const query2 = `
    from(bucket: "${bucket2}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._field == "${measurementOrField}")
      |> last()
  `;

  try {
    const [data1, data2] = await Promise.all([
      new Promise((resolve, reject) => {
        const data = [];
        queryApi.queryRows(query1, {
          next: (row, tableMeta) => {
            const o = tableMeta.toObject(row);
            data.push(o);
          },
          error: (error) => reject(error),
          complete: () => resolve(data),
        });
      }),
      new Promise((resolve, reject) => {
        const data = [];
        queryApi2.queryRows(query2, {
          next: (row, tableMeta) => {
            const o = tableMeta.toObject(row);
            data.push(o);
          },
          error: (error) => reject(error),
          complete: () => resolve(data),
        });
      })
    ]);

    return [...data1, ...data2];
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
