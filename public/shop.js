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
      domain: '6zvhm0-mu.myshopify.com',
      storefrontAccessToken: 'c233afc68457cdc3b00a15bd9b4bf638',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('product', {
        id: '8692093649050',
        node: document.getElementById('product-component-1764109270275'),
        moneyFormat: '%24%7B%7Bamount_no_decimals%7D%7D',
        options: {
          "product": {
            "layout": "horizontal",
            "iframe": false,
            "contents": {
              "img": false,
              "imgWithCarousel": true,
              "button": true,
              "title": false,
              "price": true,
              "description": true
            },
            "width": "100%",
            "styles": {
              "product": {
                "@media (min-width: 601px)": {
                  "max-width": "100%",
                  "margin-left": "0",
                  "margin-bottom": "50px"
                },
              },
              "title": {
                "color": "#ffffff"
              },
              "button": {
                "color": "#000000",
                ":hover": {
                  "color": "#000000",
                  "background-color": "#e6e6e6"
                },
                "background-color": "#ffffff",
                ":focus": {
                  "background-color": "#e6e6e6"
                }
              },
              "price": {
                "color": "#ffffff"
              },
              "compareAt": {
                "color": "#ffffff"
              },
              "unitPrice": {
                "color": "#ffffff"
              }
            },
            "text": {
              "button": "Add to cart"
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
                "color": "#000000",
                ":hover": {
                  "color": "#000000",
                  "background-color": "#e6e6e6"
                },
                "background-color": "#ffffff",
                ":focus": {
                  "background-color": "#e6e6e6"
                }
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
                "color": "#000000",
                ":hover": {
                  "color": "#000000",
                  "background-color": "#e6e6e6"
                },
                "background-color": "#ffffff",
                ":focus": {
                  "background-color": "#e6e6e6"
                }
              }
            },
            "text": {
              "total": "Subtotal",
              "notice": "Shipping and taxes at checkout.",
              "button": "Checkout"
            }
          },
          "toggle": {
            "styles": {
              "toggle": {
                "background-color": "#ffffff",
                ":hover": {
                  "background-color": "#e6e6e6"
                },
                ":focus": {
                  "background-color": "#e6e6e6"
                }
              },
              "count": {
                "color": "#000000",
                ":hover": {
                  "color": "#000000"
                }
              },
              "iconPath": {
                "fill": "#000000"
              }
            }
          }
        },
      });
    });
  }
})();
/*]]>*/
