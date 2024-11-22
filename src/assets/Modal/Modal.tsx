import "./Modal.css"
import axios from 'axios';  
import { useEffect, useState } from 'react';  
import YouTube from 'react-youtube';


interface movie {  
id: number;  
title: string;  
poster_path?: string;
backdrop_path?: string;
overview?: string;
}  

type Trailer = {  
    key: string;  
};

function Modal() {  
const API_URL = import.meta.env.VITE_URL;  
const API_KEY = import.meta.env.VITE_KEY;  
const API_IMAGE = import.meta.env.VITE_IMAGE;  

const [movies, setMovies] = useState<movie[]>([]);  
const [searchKey, setSearchKey] = useState<string>("");  

const [trailer, setTrailer] = useState<Trailer | null>(null);
const [movie, setMovie] = useState<movie | null>(null);
const [playing, setPlaying] = useState(false);

const fetchMovies = async (searchKey: string) => {  
    const type = searchKey ? "search/movie" : "movie/popular";   

try {  
    const { data: { results } } = await axios.get(`${API_URL}${type}`, {  
    params: {  
        api_key: API_KEY,  
        query: searchKey,  
    }  
    });  

    setMovies(results);  
} catch (error) {  
    console.error("Error fetching movies:", error);  
}  
};  

const fetchVideos = async(id?: number) => {
    const {data} = await axios.get(`${API_URL}movie/${id}`, {
        params: {
            api_key: API_KEY,
            append_to_response: "videos",
        },
    });

    if(data.videos && data.videos.results) {
        const trailer = data.videos.results.find(
            (video: {video: string; name: string}) => video.name.toLowerCase().includes("Trailer") 
        )
        setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
}

const selectVideo = async(movie: movie) => {
    fetchVideos(movie.id)
    setMovie(movie)

    window.scrollTo(0, 0)
}


useEffect(() => {fetchMovies("")});  
return (  

<div className="bg-dark text-white 100vh">

<div className="container mb-5">
    <h1 className="text-center my-4 fs-1 fw-bolder text-warning">Movie Search</h1>
    <div className="d-flex justify-content-center align-items-center mt-4">
        <div className="input-group w-50">
            <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Search for movies..."
                className="form-control"
            />
            <button onClick={() => fetchMovies(searchKey)} className="btn btn-primary">
                Search
            </button>
        </div>
    </div>
</div>



<div>
    <main>  
    {movie ? (  
        <div className="viewtrailer"  
            style={{  
                backgroundImage: `url("${API_IMAGE}${movie.backdrop_path}")`,  
            }}  
        >  
            {playing ? (  
                <>  
                    {trailer ? (  
                        <YouTube  
                            videoId={trailer.key} 
                            className="reproductor container"  
                            containerClassName={"youtube-container amru"}  
                            opts={{  
                                width: "100%",  
                                height: "500px",  
                                playerVars: {  
                                    autoplay: 1,  
                                    controls: 0,  
                                    cc_load_policy: 0,  
                                    fs: 0,  
                                    iv_load_policy: 0,  
                                    modestbranding: 0,  
                                    rel: 0,  
                                    showinfo: 0,  
                                    quality: 'highres'
                                },  
                            }}  
                        />  
                    ) : (  
                        <p>Sorry, no trailer available</p>  
                    )}  
                    <button onClick={() => setPlaying(false)} className="btn btn-danger mt-3">  
                        Close  
                    </button>  
                </>  
            ) : (  
                <div className="container">  
                    <div className="">  
                        {trailer ? (  
                            <button  
                                className="btn btn-success mb-3"  
                                onClick={() => setPlaying(true)}  
                                type="button"  
                            >  
                                Play Trailer  
                            </button>  
                        ) : (  
                            <p>Sorry, no trailer available</p>   
                        )}  
                        <h1 className="text-white">{movie.title}</h1>  
                        <p className="text-white">{movie.overview}</p>  
                    </div>  
                </div>  
            )}  
        </div>  
    ) : null}  
</main>
</div>


<div className="container mt-5">
<div className="row">
    {movies.map((movie) => (
    <div
        key={movie.id}
        className="col-md-4 mb-4"
        onClick={() => selectVideo(movie)}
    >
        <div className="card bg-secondary text-white shadow">
        <img
            src={`${API_IMAGE + movie.poster_path}`}
            alt=""
            className="card-img-top"
            style={{ height: "450px", objectFit: "cover" }}
        />
        <div className="card-body">
            <h5 className="card-title text-center">{movie.title}</h5>
        </div>
        </div>
    </div>
    ))}
</div>
</div>

    </div>
);
}  

export default Modal;