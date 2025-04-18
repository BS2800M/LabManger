import dayjs from "dayjs";




export const formatDateColumn = (row, column, cellValue) => {
    return formatDateTime(cellValue);
  };

function formatDateTime(isoString){
    if (isoString==null){
      return "无出库日期"
    }
    else{
      return dayjs(isoString).format('YYYY-MM-DD HH:mm')
    }
}

export const getnowtime_previousmonth = () => {  //获取上个月的时间
  return dayjs().subtract(1, 'month').format('YYYY-MM-DD')
} 
export const getnowtime = () => {  //获取当前时间
  return dayjs().format('YYYY-MM-DD')
}
export const shift_nextday=()=>{
  return dayjs().add(1, 'day').format('YYYY-MM-DD')
}

