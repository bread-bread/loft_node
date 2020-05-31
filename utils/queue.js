function initQueue (cb) {
  const q = {
    _queue: [],
    add (item) {
      q._queue.push(item);
    },
    delete (item) {
      const ndx = q._queue.indexOf(item);

      if (ndx !== -1) {
        q._queue.splice(ndx, 1);
      }

      console.log(this._queue, item, ndx);

      if (q._queue.length === 0) {
        cb();
      }
    }
  };

  return q;
}

module.exports = {
  initQueue
};
