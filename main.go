package main
import (
"embed"
"html/template"
"io"
"log"
"net/http"
"net/url"
"os"
"strconv"
)
//go:embed static
var static embed.FS
//go:embed templates
var templates embed.FS
var indexTemplate *template.Template
var gmAPIKey string

const datalasticBaseURL = "https://api.datalastic.com/api/v0/vessel_inradius?"
var datalasticAPIKey string
const datalasticAdditonalParams = "&type=fishing"

func main() {
gmAPIKey = os.Getenv("GM_API_KEY")
datalasticAPIKey = os.Getenv("DATALASTIC_API_KEY")
staticFS := http.FS(static)
staticFileServer := http.FileServer(staticFS)
var err error
indexTemplate, err = template.ParseFS(templates, "templates/index.html")
if err != nil {
 log.Fatalln(err)
}
mux := http.NewServeMux()
mux.Handle("/static/", staticFileServer)
mux.HandleFunc("/", handleIndex)

mux.HandleFunc("/api/get-vessels", handleGetVessels)

http.ListenAndServe(":8080", mux)
}

func handleGetVessels(w http.ResponseWriter, r *http.Request) {
	lat := r.URL.Query().Get("lat")
	_, err := strconv.ParseFloat(lat, 64)
	if err != nil {
	 w.Write([]byte("lat has wrong format"))
	 w.WriteHeader(http.StatusBadRequest)
	 return
	}
	lon := r.URL.Query().Get("lon")
	_, err = strconv.ParseFloat(lon, 64)
	if err != nil {
	 w.Write([]byte("lon has wrong format"))
	 w.WriteHeader(http.StatusBadRequest)
	 return
	}
	values := url.Values{}
	values.Add("lat", lat)
	values.Add("lon", lon)
	values.Add("radius", "50")
	values.Add("api-key", datalasticAPIKey)
	resp, err := http.Get(datalasticBaseURL + values.Encode() + datalasticAdditonalParams)
	if err != nil {
	 w.Write([]byte("unable to get vessels"))
	 w.WriteHeader(http.StatusInternalServerError)
	 return
	}
	if resp.StatusCode != http.StatusOK {
	 w.Write([]byte("unable to get vessels"))
	 w.WriteHeader(http.StatusInternalServerError)
	 return
	}
	io.Copy(w, resp.Body)
	defer resp.Body.Close()
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
_ = indexTemplate.Execute(w, gmAPIKey)
} 