/*
 * Autocomplete feature for docs.
 */

var rtddata = require("./rtd-data");

function autocomplete(data) {
  var project = data.project;
  var version = data.version;
  var language = data.language || "en";
  var api_host = data.api_host;

  var search_bar = document.querySelector('div[role="search"] input');
  var search_div = document.querySelector('div[role="search"]');

  var removeResults = function() {
    var previous_results = document.querySelector(".search__outer");
    if (previous_results !== null) {
      previous_results.parentNode.removeChild(previous_results);
    }
  };

  var style = document.createElement("style");
  style.innerHTML =
    ".search__outer { \
                position: fixed;\
                z-index: 10;\
                padding: 10px;\
                overflow-y: scroll;\
                max-height: 400px;\
                background-color: #fcfcfc;\
                border: 1px solid #e0e0e0;\
                -webkit-box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.09);\
                box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.09);\
                line-height: 1.875;\
                text-align: left;\
                max-width: 600px;\
              }\
              \
              .search__result__single {\
                padding: 10px;\
                border-bottom: 1px solid #e6e6e6;\
              }\
              \
              .search__result__single:hover {\
                background-color: rgb(245, 245, 245);\
              }\
              \
              .search__result__single a {\
                text-decoration: none;\
                cursor: pointer;\
              }\
              \
              .search__result__title {\
                color: #6ea0ec;\
                border-bottom: 1px solid #6ea0ec;\
                font-weight: 500;\
                margin-bottom: 0;\
                margin-top: 0;\
                display: inline-block;\
                font-size: 14px;\
              }\
              \
              .search__result__path {\
                color: #b3b3b3;\
              }\
              \
              .search__result__content {\
                text-decoration: none;\
                color: black;\
                font-size: 14px;\
                display: block;\
                margin-top: 3px;\
                margin-bottom: 5px;\
              }\
              .search__outer em {\
                font-style: normal;\
            }\
              .search__outer .search__result__title em {\
                background-color: #e5f6ff;\
                padding-bottom: 4px;\
                border-bottom-color: black;\
              }\
              .search__outer .search__result__content em {\
                background-color: #e5f6ff;\
                border-bottom: 1px solid black;\
              }";

  var ref = document.querySelector("script");
  ref.parentNode.insertBefore(style, ref);

  var convertObjToUrlParams = function(obj) {
    var params = Object.keys(obj)
      .map(function(key) {
        var s = key + "=" + obj[key];
        return s;
      })
      .join("&");
    return params;
  };

  search_bar.addEventListener("input", function(event) {
    var search_params = {
      q: encodeURIComponent(event.target.value),
      project: project,
      version: version,
      language: language
    };
    var search_url =
      api_host +
      "/api/v2/docsearch/" +
      "?" +
      convertObjToUrlParams(search_params);

    fetch(search_url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.results.length > 0) {
          no_of_suggestions = 5;

          var search_outer = document.createElement("div");
          search_outer.className = "search__outer";

          var search_result_box = document.createElement("div");
          search_result_box.className = "search__result__box";

          for (var i = 1; i <= data.results.length && i <= no_of_suggestions; ++i) {
            var search_result_single = document.createElement("div");
            search_result_single.className = "search__result__single";

            var link = document.createElement("a");
            console.log(i, data.results[i], data.results[i].link);
            link.href = data.results[i].link;

            var content = document.createElement("div");
            content.className = "content";

            var search_result_title = document.createElement("h2");
            search_result_title.className = "search__result__title";
            if (data.results[i].highlight.title !== undefined) {
              search_result_title.innerHTML =
                data.results[i].highlight.title[0];
            } else {
              search_result_title.innerHTML = data.results[i].title;
            }

            content.appendChild(search_result_title);
            content.appendChild(document.createElement("br"));

            var search_result_path = document.createElement("small");
            search_result_path.className = "search__result__path";
            search_result_path.innerHTML = data.results[i].path;
            if (data.results[i].project !== project) {
                search_result_path.innerHTML = data.results[i].path + "(from <strong>" + data.results[i].project + "</strong>)";
            }

            content.appendChild(search_result_path);

            var search_result_content = document.createElement("p");
            search_result_content.className = "search__result__content";
            if (data.results[i].highlight.content !== undefined) {
              search_result_content.innerHTML =
                "... " + data.results[i].highlight.content + " ...";
            } else {
              search_result_content.innerHTML = "";
            }

            content.appendChild(search_result_content);
            link.appendChild(content);
            search_result_single.appendChild(link);
            search_result_box.appendChild(search_result_single);
          }

          search_outer.appendChild(search_result_box);
          removeResults();
          search_div.appendChild(search_outer);
        } else {
          removeResults();
          console.log("No results", data);
        }
      })
      .catch(function(error) {
        console.log("Error Occured", error);
      });
  });
}

function init() {
  var data = rtddata.get();
  autocomplete(data);
}

module.exports = {
  init: init
};
