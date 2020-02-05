exports.validate = (url1, url2) => {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(url1) && !regex .test(url2)) {
      return false;
    }
    else {
      return true;
    }
}