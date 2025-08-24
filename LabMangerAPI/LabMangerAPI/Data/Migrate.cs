using SqlSugar;
using LabMangerAPI.Models;

namespace LabMangerAPI.Data;

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