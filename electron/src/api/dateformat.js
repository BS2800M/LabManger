import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);




export const formatDateColumn = (row, column, cellValue) => {
    return format_iso_YYYYMMDDHHmm(cellValue);
  };

export const format_iso_YYYYMMDDHHmm=(isoString)=>{ // 格式化日期时间 从iso 转换为 YYYY-MM-DD HH:mm
    if (isoString==null){
      return "无出库日期"
    }
    else{
      // 将ISO时间转换成本地时间显示
      return dayjs(isoString).format('YYYY-MM-DD HH:mm')
    }
}

export const format_YYYYMMDDHHmm_iso=(date)=>{ // 格式化日期时间 从YYYY-MM-DD HH:mm:ss 转换为 iso
  // 将本地时间转换为UTC时间
  if(date===null ){
    return ""
  }
  else{
    return dayjs(date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }
}



export const getnowtime_previousmonth = () => {  //获取上周的时间
  return dayjs().subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
} 
export const getnowtime = () => {  //获取当前时间
  return dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
}


