// src/services/influxService.js
import { InfluxDB } from '@influxdata/influxdb-client';

const url = process.env.REACT_APP_INFLUX_URL;
const token = process.env.REACT_APP_INFLUX_TOKEN;
const org = process.env.REACT_APP_INFLUX_ORG;
const bucket = process.env.REACT_APP_INFLUX_BUCKET;

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

export const fetchData = async (measurement) => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "${measurement}")
      |> last()
  `;

  return new Promise((resolve, reject) => {
    const data = [];
    queryApi.queryRows(query, {
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        data.push(o);
      },
      error: (error) => {
        console.error(error);
        reject(error);
      },
      complete: () => {
        resolve(data);
      },
    });
  });
};

export const fetchMeasurements = async () => {
  const query = `
    import "influxdata/influxdb/schema"
    schema.measurements(bucket: "${bucket}")
  `;

  return new Promise((resolve, reject) => {
    const measurements = [];
    queryApi.queryRows(query, {
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        measurements.push(o._value);
      },
      error: (error) => {
        console.error(error);
        reject(error);
      },
      complete: () => {
        resolve(measurements);
      },
    });
  });
};
