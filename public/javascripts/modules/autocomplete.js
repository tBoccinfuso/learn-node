function autoComplete(input, lat, lng){
  if(!input) return; //if not input on page, skip

  const dropdown = new google.maps.places.Autocomplete(input); // add autocomplete

  dropdown.addListener('place_changed', () => { // when autocomplete is filled out, update the lat and lng fields.
    const place = dropdown.getPlace();
    lat.value = place.geometry.location.lat();
    lng.value = place.geometry.location.lng();
  });

  input.on('keydown', (e) => {
    if(e.keyCode === 13){
      e.preventDefault();
    }
  });
}

export default autoComplete;