  export const applyVoteStyle = (event_id,votes_list,state,isDisabled,vote_type) => {

    const voteUps = document.getElementById(`votes_ups_${event_id}`)
    const voteDowns = document.getElementById(`votes_downs_${event_id}`)

    if(isDisabled || state.isSuperUser){
      voteUps.style.opacity = 0.5;
      voteUps.style.cursor = 'not-allowed';
      voteDowns.style.opacity = 0.5;
      voteDowns.style.cursor = 'not-allowed';
      return;
    }

    if(!vote_type){
      if(votes_list.ups.includes(state.userId)) {
        vote_type = 'ups'
      }else{
        if(votes_list.downs.includes(state.userId)) {
          vote_type = 'downs'
        }else{
          return
        }
      }
    }
      
    const voteDir = vote_type === 'ups' ? voteUps : voteDowns ;
    const otherDir = vote_type === 'ups' ? voteDowns : voteUps ;
    
    if(votes_list[vote_type].includes(state.userId)){
      voteDir.style.opacity = 1;
      otherDir.style.opacity = 0.5;
    }else{
      otherDir.style.opacity = 1 ;
    }

  }