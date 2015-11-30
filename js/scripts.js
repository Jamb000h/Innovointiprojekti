// Initialize variables

var debug = true;

var users = getFromLocalStorage("users");
var hashtags = getFromLocalStorage("hashtags");

//deleteTestData("all");

var user = getActiveUser();

console.log("Active user: " + user.name);

//getUserList();

//displayUser();

// Get & Save for localStorage

function getFromLocalStorage(key) {
  if(localStorage.getItem(key)) {

    if(debug) {
      console.log("The following data was fetched:")
      console.log(localStorage.getItem(key));
    }

    return JSON.parse(localStorage.getItem(key));
  } else {
    return [];
  }
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));

  if(debug) {
    console.log("The following data was saved:")
    console.log(localStorage.getItem(key));
  }
}

// Constructors

function Hashtag(hashtag) {
  this.id = hashtags.length;
  this.hashtag = hashtag;
}

function User(name) {
  this.id = users.length;
  this.name = name;
}

function Industry(name) {
  // Properties
  this.id = industries.length;
  this.name = name;
}

function Company(name, industryid) {
  // Properties
  this.id = companies.length;
  this.name = name;
  this.industry = industryid;
}

function Lead(companyId, description, urgency, hashtagList, userId) {
  // Properties
  this.id = leads.length;
  this.user = userId;
  this.company = companyId;
  this.description = description;
  this.date = new Date();
  this.status = "new";
  this.urgency = urgency;
  this.hashtagList = hashtagList;
}

function Comment(leadId, description, userId) {
  // Properties
  this.id = comments.length;
  this.user = userId;
  this.leadid = leadId;
  this.description = description;
  this.date = new Date();
}

// Add functions

function addUser() {
  var userName = document.getElementById("userName").value;

  if(userName.length < 1) {
    return alert("The username can't be empty!");
  }

  if(checkForDuplicates(users, "name", userName)) {
    return alert("A user with the same name was found!");
  }

  users.push(new User(userName));

  saveToLocalStorage("users", users);

  displayUsers();
}

function addIndustry() {

  var industryName = document.getElementById("industryName").value;

  if(industryName.length < 1) {
    return alert("The industry name can't be empty!");
  }

  if(checkForDuplicates(industries, "name", industryName)) {
    return alert("An industry with the same name was found!");
  }

  industries.push(new Industry(industryName));

  saveToLocalStorage("industries", industries);

  if(debug) {
    console.log("The following industry was added:")
    console.log(industries[industries.length - 1]);
  }

  document.getElementById("industryName").innerHTML = "";

  displayIndustries();

  updateSelectLists();

}

function addCompany() {

  var companyName = document.getElementById("companyName").value;
  var industryId = document.getElementById("industryList").value;

  if(companyName.length < 1) {
    return alert("The industry name can't be empty!");
  }

  if(checkForDuplicates(companies, "name", companyName)) {
    return alert("An industry with the same name was found!");
  }

  if(industryId == "notchosen") {
    return alert("You have to choose an industry!");
  }

  companies.push(new Company(companyName, industryId));

  saveToLocalStorage("companies", companies);

  if(debug) {
    console.log("The following company was added:")
    console.log(companies[companies.length - 1]);
  }

  document.getElementById("companyName").innerHTML = "";

  displayCompanies();

  updateSelectLists();

}

function addHashtag(text) {
  for(var i = 0; i < hashtags.length; i++) {
    if(hashtags[i].hashtag == text) {
      return false
    }
  }
  hashtags.push(new Hashtag(text));
  saveToLocalStorage("hashtags", hashtags);
}

function addLead() {

  var companyId = document.getElementById("companyList").value;
  var description = document.getElementById("leadDescription").value;
  var urgency = document.getElementById("leadUrgency").checked;

  if(description.length < 1) {
    return alert("The description can't be empty!");
  }

  if(companyId == "notchosen") {
    return alert("You have to choose a company!");
  }

  var leadHashtags = document.getElementById("hashtags").value;

  if(leadHashtags.length > 1) {

    leadHashtags = leadHashtags.split(",");

    leadHashtags.splice(leadHashtags.length - 1, 1);

    console.log(leadHashtags);

    var leadHashtagList = [];

    for(var i = 0; i < leadHashtags.length; i++) {
      addHashtag(leadHashtags[i]);
      var toList = findObjectsByProperty(hashtags, "hashtag", leadHashtags[i]);
      var alreadyListed = false;
      for(var j = 0; j < leadHashtagList.length; j++) {
        if(leadHashtagList[j] == toList[0].id) {
          alreadyListed = true;
        }
      }
      if(alreadyListed == false) {
        leadHashtagList.push(toList[0].id);
      }
    }

    location.assign("liidit.html");

  }


  leads.push(new Lead(companyId, description, urgency, leadHashtagList, user.id));

  saveToLocalStorage("leads", leads);

  if(debug) {
    console.log("The following lead was added:")
    console.log(leads[leads.length - 1]);
  }

}

function addComment(element) {

  var leadId = element.dataset.leadid;
  var description = element.previousSibling.previousSibling;

  if(description.length < 1) {
    return alert("The description can't be empty!");
  }

  comments.push(new Comment(leadId, description.value, user.id));

  saveToLocalStorage("comments", comments);

  if(debug) {
    console.log("The following lead was added:")
    console.log(comments[comments.length - 1]);
  }

  description.innerHTML = "";

  displayLeads();
}

// Utility functions

function parseDates(array) {
  for(var i = 0; i < array.length; i++) {
    array[i].date = new Date(array[i].date);;
  }
}

function checkForDuplicates(array, propertyName, value) {
  for(var i = 0; i < array.length; i++) {
    if(array[i][propertyName] == value) {
      return true;
    }
  }
  return false;
}

function delFromArrByValue(array, prop, value) {
  for(var i = 0; i < array.length; i++) {
    if(array[i][prop] == value) {
      array.splice(i, 1);
      return true;
    }
  }
  return false;
}

function findObjectsByProperty(arr, prop, val) {
  var toReturn = arr.filter(function( obj ) {
    return obj[prop] == val;
  });
  return toReturn;
}

function sortArray(array, rule, property) {
  var sorted;
  if(rule == "alphabetically") {
      sorted = array.sort(function(a, b) {
      return a[property].localeCompare(b[property]);
    });
  }
  return sorted;
}

function deleteTestData(value) {
  switch(value) {

    case "all":
      localStorage.removeItem("users");
      localStorage.removeItem("industries");
      localStorage.removeItem("companies");
      localStorage.removeItem("leads");
      localStorage.removeItem("comments");
      localStorage.removeItem("hashtags");
      users = [];
      industries = [];
      companies = [];
      leads = [];
      comments = [];
      hashtags = [];
      break;

    case "industries":
      localStorage.removeItem("industries");
      industries = [];
      break;

    case "companies":
      localStorage.removeItem("companies");
      companies = [];
      break;

    case "leads":
      localStorage.removeItem("leads");
      leads = [];
      break;

    case "comments":
      localStorage.removeItem("comments");
      comments = [];
      break;

    case "hashtags":
      localStorage.removeItem("hashtags");
      hashtags = [];
      break;
  }
  updateSelectLists();
  updateLists();
}

function getActiveUser() {
  if(users.length > 0) {
    for(var i = 0; i < users.length; i++) {
      if(users[i].status == "active") {
        return users[i];
      }
    }
    users[0].status = "active";
    return users[0];
  } else {
    users.push(new User("Default User"));
    users[0].status = "active";
    return users[0];
  }
}

function getCompanyList() {

  var toAppend;

  var targetList = document.getElementById("companyList");

  toAppend += "<option value=\"notchosen\" selected>YRITYS</option>";

  var sortedIndustries = sortArray(industries, "alphabetically", "name");

  var sortedCompanies = sortArray(companies, "alphabetically", "name");

  for(var j = 0; j < sortedIndustries.length; j++) {

    toAppend += "<optgroup label=\"" + sortedIndustries[j].name + "\">";

    for(var i = 0; i < sortedCompanies.length; i++) {

      if(sortedCompanies[i].industry == sortedIndustries[j].id) {

        toAppend += "<option value=\"" + sortedCompanies[i].id + "\">" + sortedCompanies[i].name + "</option>";

      }

    }

  }

  toAppend += "</optgroup>";

  targetList.innerHTML = toAppend;

}

function getUserList() {

  var toAppend;

  var targetList = document.getElementById("userNameList");

  var sortedUsers = sortArray(users, "alphabetically", "name");

  for(var i = 0; i < sortedUsers.length; i++) {

      if(sortedUsers[i].id === user.id) {

        toAppend += "<option value=\"" + sortedUsers[i].id + "\" disabled>" + sortedUsers[i].name + "</option>";
        console.log("Found active user and disabled it! Name: " + user.name);

      } else {

        toAppend += "<option value=\"" + sortedUsers[i].id + "\">" + sortedUsers[i].name + "</option>";
        console.log("Found normal user! Name: " + sortedUsers[i].name);

      }
  }

  targetList.innerHTML = toAppend;

}

function displayUser() {
  var target = document.getElementById("profiiliNimi");

  target.innerHTML = user.name;

}

function changeUser() {
  var id = document.getElementById("userNameList").value;

  //alert(id);

  for(var i = 0; i < users.length; i++) {
    if(users[i].status == "active") {
      users[i].status = "";
    }
  }

  for(var i = 0; i < users.length; i++) {
    if(users[i].id == id) {
      users[i].status = "active";
    }
  }

  saveToLocalStorage("users", users);

  document.location.reload(true);

}

function updateSelectLists() {

  var toAppend;

  // Add industries to company form
  var targetList = document.getElementById("industryList");

  var sortedIndustries = sortArray(industries, "alphabetically", "name");

  toAppend += "<option value=\"notchosen\" selected>TOIMIALA</option>";

  for(var i = 0; i < sortedIndustries.length; i++) {

    toAppend += "<option value=\"" + industries[i].id + "\">" + industries[i].name + "</option>";

  }

  targetList.innerHTML = toAppend;

  // Reset toAppend
  toAppend = "";
}

function displayIndustries() {
  var target = document.getElementById("industries");
  target.innerHTML = "";

  if(industries.length < 1) {
    return false;
  }
  var toAppend = "";

  var sortedIndustries = sortArray(industries, "alphabetically", "name");

  for(var i = 0; i < sortedIndustries.length; i++) {
    toAppend += "<p>" + sortedIndustries[i].name + "</p>";
  }
  target.innerHTML = toAppend;
  updateSelectLists();
}

function displayUsers() {
  var target = document.getElementById("users");
  target.innerHTML = "";

  if(users.length < 1) {
    return false;
  }
  var toAppend = "";

  var sortedUsers = sortArray(users, "alphabetically", "name");

  for(var i = 0; i < sortedUsers.length; i++) {
    toAppend += "<p>" + sortedUsers[i].name + "</p>";
  }
  target.innerHTML = toAppend;
}

function displayCompanies() {
  var target = document.getElementById("companies");
  target.innerHTML = "";

  if(companies.length < 1) {
    return false;
  }
  var toAppend = "";

  var sortedCompanies = sortArray(companies, "alphabetically", "name");

  for(var i = 0; i < sortedCompanies.length; i++) {
    toAppend += "<p><b>" + sortedCompanies[i].name + "</b> / ";

    var industry = findObjectsByProperty(industries, "id", companies[i].industry);

    toAppend += industry[0].name + "</p>";


  }
  target.innerHTML = toAppend;
}

function displayLeads() {
  var target = document.getElementById("lead_container");
  target.innerHTML = "";

  if(leads.length < 1) {
    return false;
  }

  var toAppend = "";
  for(var i = 0; i < leads.length; i++) {
    toAppend += "<div class=\"lead_box clicktoexpand\">";
    toAppend += "<div class=\"lead_box_text\">";
    /*if(leads[i].urgency == true) {
      toAppend +="<p class=\"urgent\">Urgent!</p>";
    }*/
    toAppend += "<h2>Liidi " + (i + 1) + "</h2>";
    toAppend += "<p>" + leads[i].date.toLocaleDateString() + "</p>";
    toAppend += "<p>" + leads[i].description + "</p><br />";
    /*if(leads[i].hashtagList.length > 0) {
      toAppend += "<p>";
      for(var k = 0; k < leads[i].hashtagList.length; k++) {
        var hashtagToShow = findObjectsByProperty(hashtags, "id", leads[i].hashtagList[k]);
        toAppend += hashtagToShow[0].hashtag + " ";
      }
      toAppend += "</p>";
    }*/
    toAppend += "</div>"
    toAppend += "</div>"
    toAppend += "<div class=\"expandedcontent\">";
    if(comments.length > 0) {
      for(var j = 0; j < comments.length; j++) {
        if(comments[j].leadid == leads[i].id) {
          var commentUser = findObjectsByProperty(users, "id", comments[j].user);
          toAppend += "<h3>" + comments[j].date.toLocaleDateString() + "</h3>";
          toAppend += "<p><b>" + commentUser[0].name + "</b></p>";
          toAppend += "<p>" + comments[j].description; + "</p>";
        }
      }
    }
    toAppend += "<div class=\"form-style-5\" style=\"margin-top: 10px;\">";
    toAppend += "<form class=\"commentForm\">";
    toAppend += "<textarea class=\"commentDescription\"></textarea><br />";
    toAppend += "<input type=\"button\" data-leadid=\"" + leads[i].id + "\" class=\"addComment\" value=\"Lisää kommentti\">";
    toAppend += "</form>";
    toAppend += "</div>"
    toAppend += "</div>";
  }
  target.innerHTML = toAppend;
  addCommentEventListeners();
}

function updateLists() {
  displayIndustries();
  displayCompanies();
}

// Hashtag functionality

function displayHashtag(text) {
  var target = document.getElementById("hashtags");

  var toAppend = "";

  if(target.value != "" && target.value.slice(-2) != ", ") {

    if(target.value.slice(-1) != " " && target.value.slice(-1) != ",") {

      toAppend += ", ";

    }

  }

  toAppend += "#" + text + ", ";

  target.value += toAppend;
}

function removeHashtag(element) {
  element.parentNode.removeChild(element);
}

// Event listeners

function addCommentEventListeners() {

  var className = document.getElementsByClassName("addComment");

  for(var i = 0; i < className.length; i++) {
    className[i].removeEventListener("click", addComment);
    className[i].addEventListener("click", function(evt) {
      evt.preventDefault();
      addComment(this);
    }, false);
  }

}

function addHashtagEventListeners() {

  var className = document.getElementsByClassName("hashtag");

  for(var i = 0; i < className.length; i++) {
    className[i].removeEventListener("click", addComment);
    className[i].addEventListener("click", function() {
      removeHashtag(this);
    }, false);
  }

}

/*
if(debug) {
  document.getElementById("deleteAllTestData").addEventListener("click", function() {
    deleteTestData("all");
    document.location.reload(true);
  }, false);
}
*/

function generateTestData() {
  localStorage.removeItem("users");
  localStorage.removeItem("industries");
  localStorage.removeItem("companies");
  localStorage.removeItem("leads");
  localStorage.removeItem("comments");
  localStorage.removeItem("hashtags");
  users = [];
  industries = [];
  companies = [];
  leads = [];
  comments = [];
  hashtags = [];

  users.push(new User("Mikko Mallikas")); // 0
  users.push(new User("Tiina Testikäyttäjä")); // 1
  users.push(new User("Pekka Projektipäällikkö")); // 2
  users.push(new User("Minna Myyjä")); // 3
  users.push(new User("Teppo Talonmies")); // 4
  users.push(new User("Salla Salkunhoitaja")); // 5
  saveToLocalStorage("users", users);

  industries.push(new Industry("Verkkokauppapalvelut")); // 0
  industries.push(new Industry("ICT-palvelut")); // 1
  industries.push(new Industry("Markkinointi")); // 2
  industries.push(new Industry("Vähittäiskauppa")); // 3
  industries.push(new Industry("Tutkimus ja kehitys")); // 4
  saveToLocalStorage("industries", industries);

  companies.push(new Company("Mokia Oyj", 1));
  companies.push(new Company("Verkkopuoti.com", 0));
  companies.push(new Company("CQI", 1));
  companies.push(new Company("Dikia", 1));
  companies.push(new Company("HOK-elatus", 3));
  companies.push(new Company("Jimpan PC-kauppa", 3));
  companies.push(new Company("Megamainos Oy", 2));
  companies.push(new Company("Helsingin Uliopisto", 4));

  saveToLocalStorage("companies", companies);

  hashtags.push(new Hashtag("Verkkokauppapalvelut"));
  hashtags.push(new Hashtag("ICT-palvelut"));
  hashtags.push(new Hashtag("Markkinointi"));
  hashtags.push(new Hashtag("Vähittäiskauppa"));
  hashtags.push(new Hashtag("Tutkimus ja kehitys"));
  hashtags.push(new Hashtag("Mokia Oyj"));
  hashtags.push(new Hashtag("Verkkopuoti.com"));
  hashtags.push(new Hashtag("CQI"));
  hashtags.push(new Hashtag("Dikia"));
  hashtags.push(new Hashtag("HOK-elatus"));
  hashtags.push(new Hashtag("Jimpan PC-kauppa"));
  hashtags.push(new Hashtag("Megamainos Oy"));
  hashtags.push(new Hashtag("Helsingin Uliopisto"));
  saveToLocalStorage("hashtags", hashtags);

  leads.push(new Lead(0, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", true, [0, 1], 0));
  leads.push(new Lead(1, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", true, [1, 0], 1));
  leads.push(new Lead(2, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", false, [2, 1], 2));
  leads.push(new Lead(3, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", false, [3, 1], 3));
  leads.push(new Lead(4, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", false, [4, 3], 4));
  leads.push(new Lead(5, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", true, [5, 3], 5));
  leads.push(new Lead(6, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", true, [6, 4], 1));
  leads.push(new Lead(7, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", true, [7, 4], 2));
  leads.push(new Lead(0, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", false, [0, 1], 3));
  leads.push(new Lead(2, "Suspendisse dictum consectetur eros vitae egestas. Morbi dapibus placerat nisi et laoreet. Sed massa lacus, molestie ac finibus a, rutrum quis augue.", false, [2, 1], 4));
  saveToLocalStorage("leads", leads);

  comments.push(new Comment(0, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 0));
  comments.push(new Comment(0, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 1));
  comments.push(new Comment(1, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 2));
  comments.push(new Comment(2, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 3));
  comments.push(new Comment(2, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 4));
  comments.push(new Comment(2, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 5));
  comments.push(new Comment(3, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 3));
  comments.push(new Comment(4, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 4));
  comments.push(new Comment(5, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 5));
  comments.push(new Comment(5, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 2));
  comments.push(new Comment(7, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 1));
  comments.push(new Comment(7, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat imperdiet sem at placerat.", 0));
  saveToLocalStorage("comments", comments);

  document.location.reload(true);
}
