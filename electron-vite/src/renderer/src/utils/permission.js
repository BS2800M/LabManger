const permission = {
    "0": //组员
    {user_edit:false,user_delete:false,user_add:false,
    team_edit:false,team_delete:false,team_add:false,
    operation_edit:false,operation_delete:false,
    },
    "1": //组长
    {user_edit:false,user_delete:false,user_add:false,
    team_edit:false,team_delete:false,team_add:false,
    operation_edit:false,operation_delete:false,
    },
    "2": //主任
    {user_edit:true,user_delete:true,user_add:true,
    team_edit:true,team_delete:true,team_add:true,
    operation_edit:true,operation_delete:true,
    },
    "3": //管理员
    {user_edit:true,user_delete:true,user_add:true,
    team_edit:true,team_delete:true,team_add:true,
    operation_edit:true,operation_delete:true,
    }
}

function get_permission(permission_name){
    if(localStorage.role!==undefined && localStorage.role!==null){
        return permission[localStorage.role][permission_name]
    }
    else{
        return false
    }
}

export default get_permission