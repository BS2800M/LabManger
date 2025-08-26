using SqlSugar;
namespace LabMangerAPI.Data;
public class MySqlSugar
{
    public  static SqlSugarClient Db = new SqlSugarClient(new ConnectionConfig()
        {
            ConnectionString = "datasource=data.db",
            DbType = DbType.Sqlite,
            IsAutoCloseConnection = false
        },
        db =>
        {
          //  db.Aop.OnLogExecuting = (sql, pars) =>
          //  { 
          //      Console.WriteLine(UtilMethods.GetNativeSql(sql, pars));

          //  };
        });

    
}


