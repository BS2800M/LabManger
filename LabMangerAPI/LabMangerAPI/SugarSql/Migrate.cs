using SqlSugar;
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

public class Team
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public   string Name { get; set; }="";
    
    [SugarColumn(Length = 25, IsNullable = false)]
    public  string Phone { get; set; }="";
    
    [SugarColumn(Length = 150, IsNullable = false)]
    public   string Note { get; set; }="";
    
    [SugarColumn(Length = 150, IsNullable = false)] 
    public   bool Active { get; set; }=true;
    

    
    
}

public class User
{   
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public   string UserName{ get; set; } = "";
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public   string PassWord { get; set; } ="";
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public   string Role { get; set; } ="";

    [SugarColumn(Length = 50, IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [SugarColumn(ColumnName = "Team_Id")]
    public int TeamId { get; set; } 
    

}
public class Reagent
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; } 
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public  string Name { get; set; } = "";
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public   string Specifications { get; set; } ="";

    [SugarColumn(IsNullable = false)]
    public int Price { get; set; } = 0;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public   string StorageCondition { get; set; } = "";

    [SugarColumn(IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public   string Manufacturer { get; set; }= "";
    
    [SugarColumn(Length = 200, IsNullable = false)]
    public   string  Note { get; set;}= "";

    [SugarColumn( IsNullable = false)]
    public int WarnNumber { get; set; } = 0;

    [SugarColumn(Length = 100, IsNullable = false)]
    public int WarnDays { get; set; } = 0;
    
    [SugarColumn(ColumnDataType = "datetime")] // 使用 datetime，精度到秒
    public DateTime CreateTime { get; set; } = DateTime.Now;
    
    [SugarColumn(IsNullable = false)]
    public int TeamId { get; set; } 
    
}

public class Lot
{    
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public  string Name { get; set; } = "";
    
    [SugarColumn(IsNullable = false)]
    public   int ReagentId { get; set; } = 0;

    
    [SugarColumn(ColumnDataType = "datetime")] // 使用 datetime，精度到秒
    public DateTime ExpirationDate { get; set; } = DateTime.Now;
    
    [SugarColumn(IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public int TeamId { get; set; } = 0;
    
    [Navigate(NavigateType.ManyToOne, nameof(ReagentId))]
    public Reagent? Reagent { get; set; }//注意禁止手动赋值
    
}

public class Operation
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    [SugarColumn(IsNullable = false)]
    public int  ReagentId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int  LotId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int  UserId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int TeamId { get; set; } = 0;
    
    [SugarColumn(ColumnDataType = "datetime")] // 使用 datetime，精度到秒
    public DateTime CreateTime { get; set; } = DateTime.Now;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string BarcodeNumber { get; set; } = "";
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Action { get; set; } = "";
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Note { get; set; } = "";
    [SugarColumn(IsNullable = false)]
    public bool Active { get; set; } = true;
    [Navigate(NavigateType.OneToOne, nameof(ReagentId))]
    public Reagent? Reagent { get; set; }//注意禁止手动赋值
    [Navigate(NavigateType.OneToOne, nameof(LotId))]
    public Lot? Lot { get; set; }//注意禁止手动赋值
}

public class Inventory
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(IsNullable = false)]
    public int ReagentId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int LotId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int TeamId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int Number { get; set; } = 0;



    
    [Navigate(NavigateType.OneToOne, nameof(ReagentId))]
    public Reagent? Reagent { get; set; }//注意禁止手动赋值
    [Navigate(NavigateType.OneToOne, nameof(LotId))]
    public Lot? Lot { get; set; }//注意禁止手动赋值
    
    
}