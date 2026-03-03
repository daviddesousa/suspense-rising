/*<![CDATA[*/
(function () {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: '41qwis-pi.myshopify.com', // old store
      storefrontAccessToken: '1211fbbe9fe38317790f403323d3c6db',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('product', {
        id: '8642244378762',
        node: document.getElementById('product-component-1764107187607'),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
          "product": {
            "styles": {
              "product": {
                "@media (min-width: 601px)": {
                  "max-width": "calc(25% - 20px)",
                  "margin-left": "20px",
                  "margin-bottom": "50px"
                }
              },
              "title": {
                "color": "#e6e6e6"
              },
              "button": {
                "font-size": "16px",
                "padding-top": "16px",
                "padding-bottom": "16px",
                ":hover": {
                  "background-color": "#586adf"
                },
                "background-color": "#6276f8",
                ":focus": {
                  "background-color": "#586adf"
                }
              },
              "quantityInput": {
                "font-size": "16px",
                "padding-top": "16px",
                "padding-bottom": "16px"
              },
              "price": {
                "color": "#e6e6e6"
              },
              "compareAt": {
                "color": "#e6e6e6"
              },
              "unitPrice": {
                "color": "#e6e6e6"
              }
            },
            "buttonDestination": "checkout",
            "text": {
              "button": "Buy now"
            }
          },
          "productSet": {
            "styles": {
              "products": {
                "@media (min-width: 601px)": {
                  "margin-left": "-20px"
                }
              }
            }
          },
          "modalProduct": {
            "contents": {
              "img": false,
              "imgWithCarousel": true,
              "button": false,
              "buttonWithQuantity": true
            },
            "styles": {
              "product": {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0px",
                  "margin-bottom": "0px"
                }
              },
              "button": {
                "font-size": "16px",
                "padding-top": "16px",
                "padding-bottom": "16px",
                ":hover": {
                  "background-color": "#586adf"
                },
                "background-color": "#6276f8",
                ":focus": {
                  "background-color": "#586adf"
                }
              },
              "quantityInput": {
                "font-size": "16px",
                "padding-top": "16px",
                "padding-bottom": "16px"
              },
              "title": {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "bold",
                "font-size": "26px",
                "color": "#4c4c4c"
              },
              "price": {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "18px",
                "color": "#4c4c4c"
              },
              "compareAt": {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "15.299999999999999px",
                "color": "#4c4c4c"
              },
              "unitPrice": {
                "font-family": "Helvetica Neue, sans-serif",
                "font-weight": "normal",
                "font-size": "15.299999999999999px",
                "color": "#4c4c4c"
              }
            },
            "text": {
              "button": "Add to cart"
            }
          },
          "option": {},
          "cart": {
            "styles": {
              "button": {
                "font-size": "16px",
                "padding-top": "16px",
                "padding-bottom": "16px",
                ":hover": {
                  "background-color": "#586adf"
                },
                "background-color": "#6276f8",
                ":focus": {
                  "background-color": "#586adf"
                }
              }
            },
            "text": {
              "total": "Subtotal",
              "button": "Checkout"
            },
            "popup": false
          },
          "toggle": {
            "styles": {
              "toggle": {
                "background-color": "#6276f8",
                ":hover": {
                  "background-color": "#586adf"
                },
                ":focus": {
                  "background-color": "#586adf"
                }
              },
              "count": {
                "font-size": "16px"
              }
            }
          }
        },
      });
    });
  }
})();
/*]]>*/