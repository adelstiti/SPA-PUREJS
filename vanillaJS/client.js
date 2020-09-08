import {debounce} from './debounce.js'
import {getSingleVidReq} from './getSingleVidReq.js'
import {checkValid} from './checkValid.js'
import API from './api.js'
import dataService from './dataService.js'

  const superUserId = '199807'

  export const state = {
    sortBy: 'newFirst',
    filterBy : 'all',
    searchTerm: '',
    userId : '',
    isSuperUser : false
  }

  document.addEventListener('DOMContentLoaded', () => {

    const formVidReq = document.getElementById("formEventRequest");
    const searchBox = document.getElementById("search-box");
    const sortByElms = document.querySelectorAll('[id*=sort_by_]')
    const filterByElms = document.querySelectorAll('[id^=filter_by_]')
      
    dataService.loadAll();

    sortByElms.forEach(elm => {
      elm.addEventListener('click',function(e) {
        e.preventDefault();

        state.sortBy = this.querySelector('input').value;
        dataService.loadAll(state.sortBy,state.searchTerm,state.filterBy)

        this.classList.add('active');

        if(state.sortBy === 'topVotedFirst'){
          document.getElementById('sort_by_new').classList.remove('active');
        }else{
          document.getElementById('sort_by_top').classList.remove('active');
        }

      })
    })

    filterByElms.forEach(elm => {
      elm.addEventListener('click',function(e) {
        e.preventDefault();

        state.filterBy = this.querySelector('input').value;
        dataService.loadAll(state.sortBy,state.searchTerm,state.filterBy)

        filterByElms.forEach(elm => {
          elm.classList.remove('active');
        })
        this.classList.add('active');


      })
    })
    
    formVidReq.addEventListener('submit' , (e) => {
        e.preventDefault();
        const formdata = new FormData(formVidReq);
        formdata.append('author_id',state.userId)
        const isvalid = checkValid(formdata);

        if(!isvalid){
          return;
        }
        dataService.addEventReq(formdata).then((data) => {
          getSingleVidReq(data,state,true)
        })
      
      })

    searchBox.addEventListener('input' , debounce((e) => {
      state.searchTerm = e.target.value
      dataService.loadAll(state.sortBy,state.searchTerm,state.filterBy)
    },300))

    if(window.location.search){
      state.userId = new URLSearchParams(window.location.search).get('id');
      if(state.userId === superUserId){
        state.isSuperUser = true;
        document.querySelector('.normal-user-content').classList.add('d-none')
      }

      const loginForm = document.querySelector('.login-form')
      const appContent = document.querySelector('.app-content')
      loginForm.classList.add('d-none')
      appContent.classList.remove('d-none');
    }

  })

