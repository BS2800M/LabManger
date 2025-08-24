using SqlSugar;
using LabMangerAPI.Data.Models.Entities;

namespace LabMangerAPI.SugarSql;

public class Migrate
{
    public static void Run()
    {
        MySqlSugar.Db.CodeFirst.InitTables<Team>();
        MySqlSugar.Db.CodeFirst.InitTables<User>();
        MySqlSugar.Db.CodeFirst.InitTables<Reagent>();
        MySqlSugar.Db.CodeFirst.InitTables<Lot>();
        MySqlSugar.Db.CodeFirst.InitTables<Operation>();
        MySqlSugar.Db.CodeFirst.InitTables<Inventory>();
    }
}
