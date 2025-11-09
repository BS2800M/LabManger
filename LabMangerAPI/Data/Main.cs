using SqlSugar;
namespace LabMangerAPI.Data;
public static class MySqlSugar
{
    public static SqlSugarClient Db = new SqlSugarClient(new ConnectionConfig()
    {
        // 使用简单的 SQLite 连接字符串
        ConnectionString = "Data Source=data.db",
        DbType = DbType.Sqlite,
        IsAutoCloseConnection = true,
        InitKeyType = InitKeyType.Attribute,
        // 优化连接池配置
        MoreSettings = new ConnMoreSettings()
        {
            IsAutoRemoveDataCache = true,
            IsWithNoLockQuery = true
        }
    });
}


