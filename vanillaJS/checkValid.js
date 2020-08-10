export function checkValid(formdata) {

    //validation
    const topic = formdata.get('topic_title');
    const details = formdata.get('topic_details');

    
    if(!topic || topic.length > 30){
      document.querySelector('[name=topic_title]').classList.add('is-invalid')
    }
    if(!details){
      document.querySelector('[name=topic_details]').classList.add('is-invalid')
    }

    const allInvalidElms = document.getElementById('formEventRequest').querySelectorAll('.is-invalid') ;
    if(allInvalidElms.length){
      allInvalidElms.forEach((elm) => {
        elm.addEventListener('input', function () {
          this.classList.remove('is-invalid')
        });
      });
      return false;
    }
    return true;

}