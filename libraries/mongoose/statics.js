const moment = require('moment');
const utils = require('../utils/index');

const getTimestamp = (currentUser) => {
  const result = {
    userId: currentUser?.userId || '',
    by: currentUser?.fullname || '',
    at: moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
  };
  return result;
};

async function get(q, additionalStage = []) {
  try {
    const query = q;
    if (query.perpage === '0') { query.perpage = await this.countDocuments({}); query.currpage = 0; }
    const perpage = (query.perpage) ? parseInt(query.perpage, 10) : 10;
    const currpage = (query.currpage) ? parseInt(query.currpage, 10) : 0;
    query['sort-created.at'] = (query['sort-created.at']) ? query['sort-created.at'] : -1;

    // merge array of object, the result will be merged in array1
    let arrayOr = utils.getQueryOr(query, 'likeor-', 'like');
    const arrayOr2 = utils.getQueryOr(query, 'filteror-');
    Array.prototype.push.apply(arrayOr, arrayOr2);
    // filter empty object
    arrayOr = arrayOr.filter((value) => Object.keys(value).length > 0);
    // if empty, add
    if (arrayOr.length === 0) {
      arrayOr.push({});
    }

    const result = await this.aggregate([
      {
        $facet: {
          total: [
            {
              $count: 'count',
            },
          ],
          filtered: [
            {
              $match: {
                $or: arrayOr,
                ...utils.getQuery(query, 'filterin-', 'in'),
                ...utils.getQuery(query, 'filter-'),
                ...utils.getQuery(query, 'exists-', 'exists'),
                ...utils.getQuery(query, 'filternum-', 'number'),
                ...utils.getQuery(query, 'filterobjid-', 'objid'),
                ...utils.getQuery(query, 'bool-', 'bool'),
                ...utils.getQuery(query, 'like-', 'like'),
                ...utils.betweenDate(utils.getQuery(query, 'between-')),
              },
            },
            {
              $count: 'count',
            },
          ],
          data: [
            {
              $match: {
                $or: arrayOr,
                ...utils.getQuery(query, 'filterin-', 'in'),
                ...utils.getQuery(query, 'filter-'),
                ...utils.getQuery(query, 'exists-', 'exists'),
                ...utils.getQuery(query, 'filternum-', 'number'),
                ...utils.getQuery(query, 'filterobjid-', 'objid'),
                ...utils.getQuery(query, 'bool-', 'bool'),
                ...utils.getQuery(query, 'like-', 'like'),
                ...utils.betweenDate(utils.getQuery(query, 'between-')),
              },
            },
            ...additionalStage,
            { $sort: utils.getQuery(query, 'sort-') },
            { $skip: perpage * currpage },
            { $limit: perpage },
          ],
        },
      },
    ]);

    return {
      data: result[0].data,
      filtered: result[0].filtered[0]?.count,
      total: result[0].total[0]?.count,
    };
  } catch (e) {
    return null;
  }
}

async function findById(id, additionalStage = []) {
  const item = await this.aggregate([
    { $match: { _id: utils.toObjId(id) } },
    { $addFields: { strId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: 'attachments',
        localField: 'strId',
        foreignField: 'referenceId',
        as: 'media',
      },
    },
    ...additionalStage,
  ]);
  return item[0];
}

async function store(data) {
  const timestamp = getTimestamp(data.currentUser);
  let item = new this({ ...data, created: timestamp, updated: timestamp });
  item = await item.save();
  return item;
}

async function update(id, data) {
  const timestamp = getTimestamp(data.currentUser);
  await this.updateOne({ _id: id }, { $set: { ...data, updated: timestamp } }, { runValidators: true, context: 'query' });
  const result = this.findById(id);
  return result;
}

async function deleteById(id) {
  const item = await this.findOneAndDelete({ _id: id });
  return item;
}

module.exports = {
  get,
  findById,
  store,
  update,
  deleteById,
};
