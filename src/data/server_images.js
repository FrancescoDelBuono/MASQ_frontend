
export const get_background = (name) => {
    if (name.search('mysql') >= 0) {
        return require('./img/mysql.png');
    }
    else if (name.search('mssql') >= 0) {
        return require('./img/ms_sql_server.png');
    }
    else if (name.search('no_dbms') >= 0) {
        return require('./img/ml.png');
    }
    else {
        return require('./img/default.jpg');
    }
};