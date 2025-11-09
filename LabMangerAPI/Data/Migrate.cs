using SqlSugar;
using LabMangerAPI.Models;
using System.Threading.Tasks;
using LabMangerAPI.Service;
using System.Text;
using System.Security.Cryptography;


namespace LabMangerAPI.Data;

public class Migrate
{
    public static async Task Run()
    {
        MySqlSugar.Db.CodeFirst.InitTables<Team>();
        MySqlSugar.Db.CodeFirst.InitTables<User>();
        MySqlSugar.Db.CodeFirst.InitTables<Reagent>();
        MySqlSugar.Db.CodeFirst.InitTables<Lot>();
        MySqlSugar.Db.CodeFirst.InitTables<Operation>();
        MySqlSugar.Db.CodeFirst.InitTables<Inventory>();


        var countteam=await MySqlSugar.Db.Queryable<Team>().CountAsync();
        if(countteam==0)
        {
            await MySqlSugar.Db.Insertable<Team>(new Team{//如果team表没有小组 创建一个小组
                Id=1,
                Name="初始小组",
                Note="默认小组",
                Phone=""
            }).ExecuteCommandAsync();
            Console.WriteLine("未检测到任何小组，创建一个默认小组");
        }

        var countuser=await MySqlSugar.Db.Queryable<User>().CountAsync(); //如果user表没有用户 创建一个用户
        if(countuser==0)
        {
            byte[] passwordbyte=Encoding.UTF8.GetBytes("123456");
            passwordbyte=SHA256.Create().ComputeHash(passwordbyte);
            string password = BitConverter.ToString(passwordbyte).Replace("-","");
            await MySqlSugar.Db.Insertable<User>(new User{
                UserName="admin",
                PassWord=password,
                TeamId=1,
                Role=UserRole.Admin,
            }).ExecuteCommandAsync();
            Console.WriteLine("未检测到任何用户，创建一个默认用户账户:admin 密码:123456");
        }
    }
}