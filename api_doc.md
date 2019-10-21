# AU Shop-API-Doc

### Product Details API

* **End Point:** `/api/1.0/products/details`

* **Method:** `GET`

* **Request Example:**

  `https://kelolooo.com/api/1.0/products/details?id=83189&store=chemistwarehouse`

  
* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Product id |
| store | String | Store name |

* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| data | Array | Array of `product Object` |

* **Success Response Example:**

```
{
    data: [
        {
            id: "83189",
            category: "oral-hygiene-and-dental-care",
            link: "chemistwarehouse.com.au/buy/83189/oral-b-genius-8000-silver-power-toothbrush?rcid=159",
            title: "Oral B Genius 8000 Silver Power Toothbrush",
            subTitle: "oral-b-genius-8000-silver-power-toothbrush",
            img: "https://static.chemistwarehouse.com.au/ams/media/pi/83189/hero_150.jpg",
            price: 179.99,
            discount: 120,
            originPrice: 299.99,
            store: "chemistwarehouse",
            barcode: null
        }
    ]
}
```


---

### Product Search API

* **End Point:** `/api/1.0/search`

* **Method:** `GET`

* **Request Example:**

  `https://kelolooo.com/api/1.0/search?keyword=Swisse Ultiboost Glucosamine`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| keyword | String | keywords for search |

* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| data | Array | Array of `Product Object` |

* **Success Response Example:**

```
{
    data: [
        {
            id: "571677",
            category: "VITAMINS",
            link: "https://www.woolworths.com.au/shop/productdetails/571677/swisse-ultiboost-glucosamine-sulfate-tablets",
            title: "Swisse Ultiboost Glucosamine Sulfate Tablets",
            subTitle: "swisse-ultiboost-glucosamine-sulfate-tablets-210 pack",
            img: "https://cdn1.woolworths.media/content/wowproductimages/medium/571677.jpg",
            price: 25,
            discount: 25,
            originPrice: 50,
            store: "woolworths",
            barcode: 9311770600385
        },
        {
            id: "2868817",
            category: "medicinal",
            link: "https://shop.coles.com.au/a/a-vic-metro-richmond-south/product/swisse--ultiboost-glucosamine-sulfate-tablets",
            title: "Swisse Ultiboost Glucosamine Sulfate Tablets 180 pack on special",
            subTitle: "swisse--ultiboost-glucosamine-sulfate-tablets",
            img: "https://shop.coles.com.au/wcsstore/Coles-CAS/images/2/8/6/2868817-th.jpg",
            price: 42,
            discount: 0,
            originPrice: 42,
            store: "coles",
            barcode: null
        }
    ]
}
```

* **Error Response:**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |


* **Error Response Example:**
```
{
  "error": "Wrong Request"
}
```

----
### Product List API

* **End Point:**

  `/api/1.0/products/:category`

* **Method:** `GET`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| category | String | Store name |
| paging | String(Optional) | Paging for request next page |

* **Request Example:**

  `https://kelolooo.com/api/1.0/products/bigw`  
  `https://kelolooo.com/api/1.0/products/bigw?paging=1`
  `https://kelolooo.com/api/1.0/products/bigw?filter=hair-care&paging=1`

* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| data | Array | Array of `Product Object` |
| paging(Optional) | Number | Next page number. If there are no more pages, server will not return paging parameter |
| cate | Array | Array of Category |

* **Success Response Example:**
```
{
    paging: 1,
    data: [
        {
            id: "336248",
            category: "hair-care",
            link: "https://www.bigw.com.au/product/ogx-coconut-milk-anti-breakage-serum-118ml/p/336248/",
            title: "OGX Coconut Milk Anti-Breakage Serum 118mL",
            subTitle: "ogx-coconut-milk-anti-breakage-serum-118ml",
            img: "https://www.bigw.com.au/medias/sys_master/images/images/h89/he3/12360427241502.jpg",
            price: 15,
            discount: 10,
            originPrice: 25,
            store: "bigw",
            barcode: null
        },
        {
            id: "804942",
            category: "hair-care",
            link: "https://www.bigw.com.au/product/got2b-brown-dry-shampoo-twin-pack-200ml/p/804942/",
            title: "Got2B Brown Dry Shampoo Twin Pack 200mL",
            subTitle: "got2b-brown-dry-shampoo-twin-pack-200ml",
            img: "https://www.bigw.com.au/medias/sys_master/images/images/h73/h5c/12361370697758.jpg",
            price: 8,
            discount: 10,
            originPrice: 18,
            store: "bigw",
            barcode: null
        },
        {
            id: "683514",
            category: "hair-care",
            link: "https://www.bigw.com.au/product/l-oreal-paris-age-perfect-beautifying-colour-care-chestnut/p/683514/",
            title: "L'Oreal Paris Age Perfect Beautifying Colour Care - Chestnut",
            subTitle: "l-oreal-paris-age-perfect-beautifying-colour-care-chestnut",
            img: "https://www.bigw.com.au/medias/sys_master/images/images/h86/hed/11893640986654.jpg",
            price: 8.75,
            discount: 8.75,
            originPrice: 17.5,
            store: "bigw",
            barcode: null
        }
    ],
    cate: [
        "hair-care",
        "makeup-cosmetics",
        "shaving-grooming",
        "bath-body",
        "skincare",
        "deodorant",
        "dental-care",
        "health-care",
        "fragrances"
    ]
}
```

* **Error Response:**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |


* **Error Response Example:**
```
{
  "error": "Wrong Request"
}
```
----

### User Sign Up API

* **End Point:** `/user/signup`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :---: |
| name | String | Required |
| email | String | Required |
| password | String | Required |

* **Request Body Example:**

```
{
  "name":"test",
  "email":"test@test.com",
  "pass":"test"
}
```

* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| access_token | String | Access token from server. |
| access_expired | Number | Access token expired time in seconds. |

* **Success Response Example:**

```
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0",
    "access_expired": 3600,
  }
}
```

* **Error Response:**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
  "error": "Invalid token"
}
```

----

### User Sign In API

* **End Point:** `/user/signin`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :---: |
| provider | String | Only accept `native` or `facebook` |
| email | String | Required if provider set to `native` |
| password | String | Required if provider set to `native` |
| access_token | String | Access token from facebook. Required if provider set to `facebook` |

* **Request Body Example:**

```
{
  "provider":"native",
  "email":"test@test.com",
  "password":"test"
}
```
or
```
{
  "provider":"facebook",
  "access_token": "EAACEdEose0cBAHc6hv9kK8bMNs4XTrT0kVC1RgDZCVBptXW12AI"
}
```

* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| access_token | String | Access token from server. |
| access_expired | Number | Access token expired time in seconds. |

* **Success Response Example:**

```
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0",
    "access_expired": 3600,
  }
}
```

* **Error Response:**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
  "error": "Invalid token."
}
```

----

### User Add or Delete Wishlist API

>Authorization

* **End Point:** `/api/1.0/wishlist`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Authorization | String | Access token preceding `Bearer `. For example: `Bearer x48aDD534da8ADSD1XC4SD5S` |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :---: |
| product_id | Number | product_id |
| store | String | store name |

* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| data | Object | `add` or `delete` wishlist item |

* **Success Response Example:**

```
{
  "data": {"add"}
}
```
or

```
{
  "data": {"delete"}
}
```


----

### User Wishlist API

>Authorization

* **End Point:** `/api/1.0/user/wishlist`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Authorization | String | Access token preceding `Bearer `. For example: `Bearer x48aDD534da8ADSD1XC4SD5S` |


* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| data | Array | Array of `Product Object` |

* **Success Response Example:**
```
{
    "data": [
        {
            "id": "678321",
            "user_id": 1,
            "product_id": "678321",
            "store": "bigw",
            "category": "dental-care",
            "link": "https://www.bigw.com.au/product/oral-b-pro-health-clean-mint-toothpaste-190g/p/678321/",
            "title": "Oral-B Pro-Health Clean Mint Toothpaste 190g",
            "subTitle": "oral-b-pro-health-clean-mint-toothpaste-190g",
            "img": "https://www.bigw.com.au/medias/sys_master/images/images/ha9/h0f/11775754305566.jpg",
            "price": 3.47,
            "discount": 3.48,
            "originPrice": 6.95,
            "barcode": 0
        },
        {
            "id": "90617",
            "user_id": 1,
            "product_id": "90617",
            "store": "chemistwarehouse",
            "category": "oral-hygiene-and-dental-care",
            "link": "chemistwarehouse.com.au/buy/90617/oral-b-genius-series-9000-orchard-purple-power-toothbrush?rcid=159",
            "title": "Oral B Genius Series 9000 Orchard Purple Power Toothbrush",
            "subTitle": "oral-b-genius-series-9000-orchard-purple-power-toothbrush",
            "img": "https://static.chemistwarehouse.com.au/ams/media/pi/90617/hero_150.jpg",
            "price": 204.99,
            "discount": 145,
            "originPrice": 349.99,
            "barcode": null
        }
    ]
}
```

* **Error Response:**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message. |

* **Error Response Example:**
```
{
  "error": "Wrong Request: authorization is required."
}
```

