const apiUrl = 'https://spa-purejs.herokuapp.com'
export default {
    eventReq : {
        get : (sortBy,searchTerm,filterBy) => {
            return fetch(`${apiUrl}/event-request?sortBy=${sortBy}&search=${searchTerm}&filterBy=${filterBy}`)
            .then((res) => res.json())
        },
        post :  (formdata) => {
           return fetch(`${apiUrl}/event-request`,{method : 'Post',body : formdata})
            .then((res) => res.json())
        },
        update : (id,status,resEvent) => {
            return fetch(`${apiUrl}/event-request`,
                {method : 'PUT',
                headers : {'content-Type' : 'application/json'},
                body : JSON.stringify({id,status,resEvent})})
                .then((res) => res.json())
        },
        delete :  (id) => {
            return fetch(`${apiUrl}/event-request`,
                {method : 'DELETE',
                headers : {'content-Type' : 'application/json'},
                body : JSON.stringify({id})
            }).then((res) => res.json())
        }
    },
    votes : {
        update:  (id,vote_type,userId) => {
            return fetch(`${apiUrl}/event-request/vote`,
            {method : 'PUT'
            ,headers: {'content-Type' : 'application/json'}
            ,body : JSON.stringify({id,vote_type,userId})
        })
        .then((res) => res.json())
        }
    }
}