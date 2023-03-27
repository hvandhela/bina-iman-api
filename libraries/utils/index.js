const moment = require('moment');
const mongoose = require('mongoose');

const toObjId = (string) => mongoose.Types.ObjectId(string);

const getQuery = (query, keyword, type) => { // untuk pencarian di dalam list
  const res = {};
  Object.keys(query).forEach((key) => {
    if (key.includes(keyword)) {
      const newKey = key.replace(keyword, '');
      if (type === 'like') {
        res[newKey] = { $regex: `.*${query[key]}.*`, $options: 'i' };
      } else if (type === 'bool') {
        if (query[key] === 'false' || query[key] === '0') {
          res[newKey] = false;
        } else if (query[key] === 'true' || query[key] === '1') {
          res[newKey] = true;
        } else {
          res[newKey] = false;
        }
      } else if (type === 'number') {
        res[newKey] = Number(query[key]);
      } else if (type === 'in') {
        res[newKey] = { $in: query[key] };
      } else if (type === 'objid') {
        res[newKey] = mongoose.Types.ObjectId(query[key]);
      } else if (type === 'exists') {
        if (query[key] === 'false' || query[key] === '0') {
          res[newKey] = null;
        } else if (query[key] === 'true' || query[key] === '1') {
          res[newKey] = { $ne: null };
        } else {
          res[newKey] = { $ne: null };
        }
      } else if (Array.isArray(query[key])) {
        res[newKey] = { $in: query[key] };
      } else { res[newKey] = query[key]; }
    }
  });

  return res;
};

const getQueryOr = (query, keyword, type) => { // untuk pencarian di dalam list
  const res = [];
  Object.keys(query).forEach((key) => {
    const obj = {};
    if (key.includes(keyword)) {
      const newKey = key.replace(keyword, '');
      if (type === 'like') {
        obj[newKey] = { $regex: `.*${query[key]}.*`, $options: 'i' };
      } else {
        obj[newKey] = query[key];
      }
    }
    if (Object.keys(obj).length > 0) res.push(obj);
  });

  if (res.length > 0) {
    return res;
  }
  return [{}];
};

const betweenDate = (filter) => {
  const res = {};

  Object.keys(filter).forEach((key) => {
    const string = filter[key];
    const dates = string.split('|');
    if (string.indexOf('|') === string.length - 1) { // jika hanya startdate
      dates[1] = '2100-01-01';
    } else if (string.indexOf('|') === 0) { // jika hanya enddate
      dates[0] = '1900-01-01';
    }

    res[key] = {
      $gte: new Date(moment(dates[0]).utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')),
      $lte: new Date(moment(dates[1]).utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')),
    };
  });

  return res;
};


const getFirstDayOfPastMonths = async (months) => {
  const res = moment().utc().subtract(months, 'months').startOf('month')
    .format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  return res;
};

const getLastDayOfPastMonths = async (months) => {
  const res = moment().utc().subtract(months, 'months').endOf('month')
    .format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  return res;
};

const getMonthNumber = (monthName) => {
  let months = {};
  if (monthName.length < 4) {
    months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
  } else {
    months = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };
  }

  return months[monthName];
};

const makeRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const capitalize = (str) => str
  .toLowerCase()
  .split(' ')
  .map((word) => word[0].toUpperCase() + word.substr(1))
  .join(' ');

module.exports = {
  getQuery,
  getQueryOr,
  betweenDate,
  getFirstDayOfPastMonths,
  getLastDayOfPastMonths,
  getMonthNumber,
  toObjId,
  makeRandomString,
  capitalize,
};
