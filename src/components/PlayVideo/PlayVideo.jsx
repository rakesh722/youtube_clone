import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import save from '../../assets/save.png'
import share from '../../assets/share.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_key, value_converter } from '../../data'
import moment from 'moment'
import { useParams } from 'react-router-dom'



const PlayVideo = ({}) => {

    const{videoId} = useParams();

 const[apiData,setApiData]=useState(null);
  const[channeldata,setchannelData] = useState(null);
    const[commentdata,setcommentData] = useState([]);
 
 const fetchData = async ()=>{

    const video_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_key}`;
    
   await fetch(video_url).then(res=>res.json()).then(data=>setApiData(data.items[0]));

}






 const otherData = async ()=>{

    const video_url2 = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_key}`
    
   await fetch(video_url2).then(res=>res.json()).then(data=>setchannelData(data.items[0]));


    const video_url3 = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_key}`

   await fetch(video_url3).then(res=>res.json()).then(data=>setcommentData(data.items));


}




useEffect(()=>{

fetchData();

},[videoId])




useEffect(()=>{
otherData();
},[apiData])



  return (
  <div className="play-video">


  <iframe  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


    <h3>{apiData?apiData.snippet.title:"title"}</h3>

    <div className="play-video-info">
        <p>{apiData?value_converter(apiData.statistics.viewCount):"1k"} &bull;  {apiData?moment(apiData.snippet.publishedAt).fromNow():""}  </p>
      <div>
      <span><img src={like} alt="" />{apiData?value_converter(apiData.statistics.likeCount):"1k"}</span>
            <span><img src={dislike} alt="" />{apiData?value_converter(apiData.statistics.dislikeCount):"1k"}</span>
                  <span><img src={share} alt="" />share</span>
                        <span><img src={save} alt="" />save</span>
    </div>

    </div>

    <hr />

    <div className="publisher">
        <img src={channeldata?channeldata.snippet.thumbnails.default.url:"image please"} alt="" />
        <div>
            <p> {apiData?apiData.snippet.channelTitle :"" }</p>
            <span>{channeldata?value_converter(channeldata.statistics.subscriberCount):"subsribers" } <span>Subscribers</span></span>
        </div>
          <button>Subsribe</button>
    </div>
    <div className="vid-description">
        <p>{apiData?apiData.snippet.description.slice(0,250):"description here"}</p>
        
        <hr />
        <h4>{apiData?value_converter(apiData.statistics.commentCount):"1k"}   <span>Comments</span></h4>

        {commentdata.map((item,index)=>{

    return(

        
        <div  key={index}className="comment">
            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
            <div>
                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                    <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                    <img src={like} alt="" />
                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                    <img src={dislike} alt="" />
                    
                </div>

            </div>

        </div>


    )


        })}



     
    </div>

  </div>
  )
}

export default PlayVideo
