const mysql = require('mysql2/promise');
let pool;

async function initPool() {
  pool = mysql.createPool({
    // host: 'chir104.websitehostserver.net',
    // user: 'rsucmsco_joseph4290',
    // password: 'rsucmsco_joseph4290',
    // database: 'rsucmsco_joseph4290',
    host: 'localhost',
    user: 'Smart',
    password: 'Uchenna',
    database: 'smart_hotel',
    waitForConnections: true,
    connectionLimit: 10, // Max number of connections in the pool
    queueLimit: 0, // Unlimited queue limit
  });
}

async function testConn() {
  await initPool();
  let connection;
  
  try {
    connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS EMPLOYEES (
        EMPLOYEE_ID INT PRIMARY KEY AUTO_INCREMENT,
        FIRST_NAME VARCHAR(50),
        LAST_NAME VARCHAR(50),
        PHONE VARCHAR(20),
        PASSWORD VARCHAR(80)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS GUEST (
        GUEST_ID INT PRIMARY KEY AUTO_INCREMENT,
        RES_NR INT,
        FIRST_NAME VARCHAR(50),
        LAST_NAME VARCHAR(50),
        PHONE VARCHAR(20),
        EMAIL VARCHAR(40),
        ADDRESS VARCHAR(100),
        PASSWORD VARCHAR(80)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS HOTEL (
        HOTEL_CODE INT PRIMARY KEY AUTO_INCREMENT,
        EMPLOYEE_ID INT,
        HOTEL_NAME VARCHAR(100),
        LOCATION VARCHAR(100),
        NUM_ROOMS INT,
        FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEES(EMPLOYEE_ID)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS RESERVATION (
        RES_NR INT PRIMARY KEY AUTO_INCREMENT,
        GUEST_ID INT,
        HOTEL_CODE INT,
        ROOM_TYPE VARCHAR(50),
        ROOM_NUM INT,
        CHECKIN DATE NOT NULL,
        CHECKOUT DATE NOT NULL,
        FOREIGN KEY (GUEST_ID) REFERENCES GUEST(GUEST_ID),
        FOREIGN KEY (HOTEL_CODE) REFERENCES HOTEL(HOTEL_CODE)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS ROOM (
        ROOM_ID INT PRIMARY KEY AUTO_INCREMENT,
        ROOM_TYPE VARCHAR(50),
        GUEST_ID INT,
        ROOM_NR VARCHAR(200),
        PRICE DECIMAL,
        HOTEL VARCHAR(100),
        FOREIGN KEY (GUEST_ID) REFERENCES GUEST(GUEST_ID)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS BILL (
        INVOICE_NR INT PRIMARY KEY AUTO_INCREMENT,
        GUEST_ID INT,
        ROOM_CHARGE DECIMAL(10,2),
        MISC_CHARGES DECIMAL(10,2),
        FOREIGN KEY (GUEST_ID) REFERENCES GUEST(GUEST_ID)
      );
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
}


async function connect() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'Smart',
    password: 'Uchenna',
    database: 'smart_hotel'
  });
  console.log('Connected to MySQL');
  
}

async function query(sql, params) {
  if (!pool) {
    await initPool(); // Ensure the pool is initialized (from earlier code)
  }

  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool

    let result = [];
    console.log("params", params);
    console.log("sql", sql);

    if (Array.isArray(params) && params.length > 0) {
      result = await connection.execute(sql, params);
    } else {
      result = await connection.execute(sql);
    }

    return result;
  } catch (err) {
    console.error('Error with the query:', err);
    throw err; // Re-throw the error for handling in the calling code
  } finally {
    if (connection) connection.release(); // Release connection back to the pool
  }
}
async function close() {
  console.log('MySQL pool close');
  if (pool) {
    await pool.end(); // Close all connections in the pool
    console.log('MySQL pool closed');
  }
}

module.exports = { connect, query, close, testConn };
