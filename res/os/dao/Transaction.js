export function nedbFindOne(db, query) {
  return new Promise((resolve, reject) =>
    db.findOne(query, (err, documents) => {
      if (err) {
        reject(err);
      } else {
        resolve(documents);
      }
    })
  );
}

export function nedbInsert(db, data) {
  return new Promise((resolve, reject) =>
    db.insert(data, (err, documents) => {
      if (err) {
        reject(err);
      } else {
        resolve(documents);
      }
    })
  );
}

export function nedbUpdate(db, query, data) {
  return new Promise((resolve, reject) =>
    db.update(query, { $set: data }, (err, documents) => {
      if (err) {
        reject(err);
      } else {
        resolve(documents);
      }
    })
  );
}

export function nedbDelete(db, query) {
  return new Promise((resolve, reject) =>
    db.remove(query, {}, (err, documents) => {
      if (err) {
        reject(err);
      } else {
        resolve(documents);
      }
    })
  );
}
