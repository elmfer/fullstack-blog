const HandleBarHelpers = {
  format_time: (date) => { 
    return date.toLocaleTimeString(); 
  },
  format_date: (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
};

module.exports = HandleBarHelpers;