const db = require('../models/freshModel.js');

const listController = {
    //Sign-up - Add to users table
    //Login - Query users table to confirm name & password, return user_id & household_id (if any)
    // getList - Query items table & return items associated w user (_id, names, priority, shared?, location)
    getList (req, res, next) {
      // console.log("here is what getList is getting: ", req.body)
      const query = `
        SELECT _id, name, priority, location, shared
        FROM items
        WHERE user_id = $1`
      
      db.query(query, [req.cookies.user_id], (err, data) => {
        if(err) {
          return next({
            log: `Express error handler caught in getList ERROR: ${err}`,
            message: { 'err': 'An error occurred in getList' }})
        } 
        else {
          // console.log('Result of getList query: ', data.rows);
          res.locals.items = data.rows;
          return next();
        }
      });
    },

    //addItem - Insert into items table based on userid, priority, shareable?, location... next getList
    addItem (req, res, next) {
      // console.log('Request Body: ', req.body);

      const query = `
        INSERT INTO items (name, priority, location, shared, user_id)
        VALUES ($1, $2, $3, $4, $5)`
      
        const entries = [req.body.name, req.body.priority, req.body.location, req.body.shared, req.cookies.user_id];
        db.query(query, entries, (err, data) => {
          if(err) {
            return next({
              log: `Express error handler caught in addItem ERROR: ${err}`,
              message: { 'err': 'An error occurred in addItem' }})
          } 
          else {
            // console.log('Result of addItem query: ', data);
            return next();
          }
        })
    },

    //removeitem - Delete from items table based on item_id.... next getList
    deleteItem (req, res, next) {
      const query = `
        DELETE FROM items
        WHERE _id = $1`
      const id = [req.body.id];
      db.query(query, id, (err, data) => {
        if(err) {
          return next({
            log: `Express error handler caught in deleteItem ERROR: ${err}`,
            message: { 'err': 'An error occurred in deleteItem' }})
        } 
        else {
          // console.log('Result of deleteItem query: ', data);
          return next();
        }
      });
    },
    
    //updateItem - based on column to update & new value, item_id.... next getList
    updateItem (req, res, next) {
      // console.log('Data type of item id: ', typeof req.body.id);
      const query = 'UPDATE items SET ' + req.body.set + ' = ' + req.body.newVal +
      'WHERE _id = ' +  req.body.id;
      
      // alternative (less secure) approach: insert variable parameters into query using template literals ${___}
      //$1 = location/priority/shared, $2 = updated value, $3 = _id of the item
      /*
        const query = `
        UPDATE items 
        SET ${req.body.set} = $1
        WHERE _id = $2`;
        const columnInfo = [req.body.newVal, req.body.id];
      */
      
        db.query(query, (err, data) => {
            if(err) {
                return next({
                  log: `Express error handler caught in updateItem ERROR: ${err}`,
                  message: { 'err': 'An error occurred in updateItem' }})
              } 
              else {
                // console.log('Result of updateItem query: ', data);
                return next();
              } 
        });
    }
    //moving is just updating location
}

module.exports = listController;
