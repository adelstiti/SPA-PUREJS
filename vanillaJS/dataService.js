import {getSingleVidReq} from './getSingleVidReq.js'
import {state} from './client.js'
const listOfVids = document.getElementById("listOfRequests");
import API from './api.js'
import {applyVoteStyle} from './applyVoteStyle.js'

export default {
    addEventReq: (formdata) => { return API.eventReq.post(formdata)
    },
    updateEventStatus : (id,status,resEvent = '') => { 
        return API.eventReq.update(id,status,resEvent)
        .then((_) => {window.location.reload(); }) 
    },
    deleteEventReq : (id) => {
        return API.eventReq.delete(id)
        .then((_) => { window.location.reload(); })
    },
    loadAll : (sortBy = 'newFirst',searchTerm='',filterBy='all') => {
        return API.eventReq.get(sortBy,searchTerm,filterBy)
        .then((data) => { 
            listOfVids.innerHTML = '' 
            data.forEach(eventInfo => {  getSingleVidReq(eventInfo,state) })
            })
    },
    vote : (id,vote_type,userId,isDone) => {
        const scoreVote = document.getElementById(`score_vote_${id}`)
        return API.votes.update(id,vote_type,userId)
        .then((data) => {
            scoreVote.innerText = data.ups.length - data.downs.length ;
            applyVoteStyle(id,data,state,isDone,vote_type)
        })
    }
}