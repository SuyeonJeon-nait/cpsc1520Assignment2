/* 
<tr>
  <td>ALBUM NAME HERE</td>
  <td>RELEASE DATE HERE</td>
  <td>ARTIST NAME HERE</td>
  <td>GENRE HERE</td>
  <td>AVERAGE RATING HERE</td>
  <td>NUMBER OF RATINGS HERE</td>
</tr> 
*/

let albumStore;

async function appInit(){
  const res = await fetch('public/data/albums.json');
  const data = await res.json();
  albumStore = [...data];
  render(albumStore, document.querySelector('#album-rows'));
}

appInit();

//Add a submit event  to the form
document.querySelector('#album-search-form').addEventListener('submit', handleSubmitForm);

//submit function
function handleSubmitForm(e){
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const albumTitle = formData.get('search').trim().toLowerCase();
  const albumRating = parseFloat(formData.get('min-album-rating').trim());

  let filterResult;
  if (albumTitle && albumRating) {
    const titleRes = titleResult(albumStore, albumTitle);
    const ratingRes = ratingResult(albumStore, albumRating);
    filterResult = titleRes.filter(album => ratingRes.includes(album));
  } else if (albumTitle) {
    filterResult = titleResult(albumStore, albumTitle);
  } else if (albumRating) {
    filterResult = ratingResult(albumStore, albumRating);
  } else {
    filterResult = albumStore;
  }
  render(filterResult, document.querySelector('#album-rows'));
}

//Text input field Search
function titleResult(albums, query) {
  const lowerQuery = query.toLowerCase().trim();
  return albums.filter(album => 
    album.album.toLowerCase().includes(lowerQuery) || album.artistName.toLowerCase().includes(lowerQuery)
  );
}

//Number Text field Search
function ratingResult(albums, minRating) {
  return albums.filter(album => album.averageRating >= minRating);
}

//Render Function
function render(albums, container){
  container.innerHTML = '';
    albums.forEach((album) =>{
      const template = 
      `<tr>
        <td>${album.album}</td>
        <td>${album.releaseDate}</td>
        <td>${album.artistName}</td>
        <td>${album.genres}</td>
        <td>${album.averageRating}</td>
        <td>${album.numberRatings}</td>
      </tr>`;
      container.insertAdjacentHTML('beforeend', template);
    });
  }