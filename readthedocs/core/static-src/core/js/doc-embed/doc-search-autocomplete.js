function dummy() {
  var search_bar = document.querySelector('div[role="search"] input');
  var search_div = document.querySelector('div[role="search"]');
  search_bar.addEventListener("input", function(event) {
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
              .search__outer .hlt1 {\
                font-style: normal;\
            }\
              .search__outer .search__result__title .hlt1 {\
                background-color: #e5f6ff;\
                padding-bottom: 4px;\
                border-bottom-color: black;\
              }\
              .search__outer .search__result__content .hlt1 {\
                background-color: #e5f6ff;\
                border-bottom: 1px solid black;\
              }";

    var ref = document.querySelector("script");
    ref.parentNode.insertBefore(style, ref);
    // var previous_results = document.querySelector(".search__outer");
    // if (previous_results !== null) {
    //   previous_results.parentNode.removeChild(previous_results);
    // }
    fetch("/search/auto?q=" + event.target.value)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.hits.hits.length > 0) {
          // var previous_results = document.querySelector(".search__outer");
          // if (previous_results) {
          //   search_div.removeChild(previous_results);
          // }

          var search_outer = document.createElement("div");
          search_outer.className = "search__outer";

          var search_result_box = document.createElement("div");
          search_result_box.className = "search__result__box";

          for (i = 0; i < data.hits.hits.length; i++) {
            var search_result_single = document.createElement("div");
            search_result_single.className = "search__result__single";

            var link = document.createElement("a");
            link.href = "";

            var content = document.createElement("div");
            content.className = "content";

            var search_result_title = document.createElement("h2");
            search_result_title.className = "search__result__title";
            if (
              data.hits.hits[i].highlight["title.autocomplete"] !== undefined
            ) {
              search_result_title.innerHTML =
                data.hits.hits[i].highlight["title.autocomplete"][0];
            } else {
              search_result_title.innerHTML = data.hits.hits[i]._source.title;
            }

            content.appendChild(search_result_title);
            content.appendChild(document.createElement("br"));

            var search_result_path = document.createElement("small");
            search_result_path.className = "search__result__path";
            search_result_path.innerHTML = data.hits.hits[i]._source.path;

            content.appendChild(search_result_path);

            var search_result_content = document.createElement("p");
            search_result_content.className = "search__result__content";
            search_result_content.innerHTML =
              "... " +
              data.hits.hits[i].highlight["content.autocomplete"][0] +
              " ...";

            content.appendChild(search_result_content);
            link.appendChild(content);
            search_result_single.appendChild(link);
            search_result_box.appendChild(search_result_single);
          }

          search_outer.appendChild(search_result_box);
          var previous_results = document.querySelector(".search__outer");
          if (previous_results !== null) {
            previous_results.parentNode.removeChild(previous_results);
          }
          search_div.appendChild(search_outer);
        } else {
          var previous_results = document.querySelector(".search__outer");
          if (previous_results !== null) {
            previous_results.parentNode.removeChild(previous_results);
          }
          console.log("ERROR", data);
        }
      })
      .catch(function(error) {
        console.log("Error Occured", error);
      });
  });
}

function init() {
  dummy();
}

module.exports = {
  init: init
};
