import {applyVoteStyle} from './applyVoteStyle.js'
import dataService from './dataService.js'

const listOfVids = document.getElementById("listOfRequests");

const formatDate = (date) => new Date(date).toLocaleDateString() ;

const actionsAdmin = (_id,status) => {
  return `<div class="card-header d-flex justify-content-between">
            <select id="admin_change_status_${_id}">
              <option value="new">new</option>
              <option value="planned">planned</option>
              <option value="done">done</option>
            </select>
            <div class="input-group ml-2 mr-5 ${ status !== 'done' ? 'd-none' : ''}" id="admin_event_res_container_${_id}">
              <input type="text" class="form-control"
                id="admin_event_res_${_id}" 
                placeholder="paste here workshop post link">
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" 
                  id="admin_save_event_res_${_id}"
                  type="button">Save</button>
              </div>
            </div>
            <button id="admin_delete_event_req_${_id }" class='btn btn-danger'>delete</button>
          </div>`
}

const bindAdminActions = (_id,status,event_ref,topic_title,state) => {

  const adminChangeState = document.getElementById(`admin_change_status_${_id}`)
  const adminVidResol = document.getElementById(`admin_event_res_${_id}`)
  const adminVidResolContainer = document.getElementById(`admin_event_res_container_${_id}`)
  const adminVidSave = document.getElementById(`admin_save_event_res_${_id}`)
  const adminVidDelete = document.getElementById(`admin_delete_event_req_${_id}`)

  if(state.isSuperUser){
      adminChangeState.value = status;
      adminVidResol.value = event_ref.link ;
      adminChangeState.addEventListener('change', (e) => {
        if(e.target.value === 'done'){
          adminVidResolContainer.classList.remove('d-none')
        }else{
          dataService.updateEventStatus(_id,e.target.value)
        }
      })
      
      adminVidSave.addEventListener('click', (e) => {
        e.preventDefault();
        if(!adminVidResol.value){
          adminVidResol.classList.add('is-invalid')
          adminVidResol.addEventListener('input',() => {
            adminVidResol.classList.remove('is-invalid')
          })
          return;
        }
        dataService.updateEventStatus(_id,'done',adminVidResol.value)
      })

      adminVidDelete.addEventListener('click', (e) => {
        e.preventDefault();
        const isSure = confirm(`Are you sure you want to delete ${topic_title}`);
        if(!isSure){ return; }
        dataService.deleteEventReq(_id);
      })

  }
}

const bindVoteAction = (_id,status,state) => {

  const voteElms = document.querySelectorAll(`[id^=votes_][id$=_${_id}]`) 
 
  voteElms.forEach((vote) => {
    if(state.isSuperUser || status === 'done'){
      return;
    }

    vote.addEventListener('click' , (e) => {
      e.preventDefault();
      const [,vote_type,id] = e.target.getAttribute('id').split('_');
      dataService.vote(id,vote_type,state.userId,status === 'done')
    })
  })

}

export const getSingleVidReq = ({ 
  _id,
  status,
  topic_details,
  topic_title,
  expected_result,
  event_ref,
  votes,
  author_name,
  submit_date,
  target_level
},state,isPrepend = false) => {

  const statusClass = status === 'done' ? '#2a9d8f' : status === 'planned' ? '#f4a261' : '' ;
  const voteScore = votes.ups.length - votes.downs.length ;
  const eventReqContainerElm = document.createElement('div')

  eventReqContainerElm.innerHTML = `
    <div class="card mb-3">
      ${state.isSuperUser ? actionsAdmin(_id,status)  : ''}
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${topic_title}</h3>
          <p class="text-muted mb-2">${topic_details}</p>
          <p class="mb-0 text-muted">
            ${ expected_result  && `<strong>Expected results:</strong> ${expected_result}`}
          </p>
        </div>
        ${status === 'done' ? 
          `<div class="ml-auto mr-3">
            <iframe width="240" height="135" src="https://www.facebook.com/plugins/post.php?href=${event_ref.link}" 
            allowfullscreen frameborder="0"></iframe>
          </div>` : '' }

        <div class="d-flex flex-column text-center">
          <a id="votes_ups_${_id}" class="btn btn-link">🔺</a>
          <h3 id="score_vote_${_id}">${voteScore}</h3>
          <a id="votes_downs_${_id}" class="btn btn-link">🔻</a>
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div style="color : ${statusClass}" >
          <span>${status.toUpperCase()} 
          ${ status === 'done' ? `On ${formatDate(event_ref.date)}` : '' }
          </span>
          &bullet; added by <strong>${author_name}</strong> on
          <strong>${formatDate(submit_date)}</strong>
        </div>
        <div class="d-flex justify-content-center flex-column 408ml-auto mr-2" >
          <div class="badge badge-success">
            ${target_level}
          </div>
        </div>
      </div>
    </div>`

    if(isPrepend){ listOfVids.prepend(eventReqContainerElm)}
    else{ listOfVids.appendChild(eventReqContainerElm)}

    applyVoteStyle(_id,votes,state,status === 'done');

    bindVoteAction(_id,status,state);

    bindAdminActions(_id,status,event_ref,topic_title,state);
}