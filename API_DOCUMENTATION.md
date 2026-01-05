# API Documentation - CNPM Backend

## Mục Lục

1. [Authentication (User)](#authentication-user)
2. [Agents (Đại lý)](#agents-đại-lý)
3. [Agent Types (Loại đại lý)](#agent-types-loại-đại-lý)
4. [Products (Sản phẩm)](#products-sản-phẩm)
5. [Districts (Quận/Huyện)](#districts-quận-huyện)
6. [Units (Đơn vị)](#units-đơn-vị)
7. [Export Notes (Phiếu xuất hàng)](#export-notes-phiếu-xuất-hàng)
8. [Receipts (Phiếu thu tiền)](#receipts-phiếu-thu-tiền)
9. [Reports (Báo cáo)](#reports-báo-cáo)

---

## Authentication (User)

### Base URL: `/user`

> **Lưu ý:** API đăng ký và đăng nhập không yêu cầu JWT token. Các API khác yêu cầu header `Authorization: Bearer {token}`

---

#### 1. Register - Đăng ký tài khoản mới

- **Method:** `POST`
- **URL:** `/user`
- **Body:**
  ```json
  {
    "fullName": "Nguyễn Văn A",
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Create user",
    "data": {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "email": "user@example.com",
      "username": "username",
      "createdAt": "2024-01-02T...",
      "updatedAt": "2024-01-02T..."
    }
  }
  ```

---

#### 2. Login - Đăng nhập

- **Method:** `POST`
- **URL:** `/user/login`
- **Body:**
  ```json
  {
    "username": "username",
    "password": "password123"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "id": 1,
      "fullName": "Nguyễn Văn A",
      "email": "user@example.com",
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```
- **Cookies:** Tự động set `refreshToken` trong httpOnly cookie

---

#### 3. Refresh Token - Làm mới access token

- **Method:** `POST`
- **URL:** `/user/refresh`
- **Headers:** Gửi refreshToken trong cookies (tự động)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Refresh token successful",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

---

#### 4. Logout - Đăng xuất

- **Method:** `POST`
- **URL:** `/user/logout`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

---

## Agents (Đại lý)

### Base URL: `/api/agents`

> **Yêu cầu:** JWT token trong header `Authorization: Bearer {token}`

---

#### 1. Create Agent - Tạo đại lý mới

- **Method:** `POST`
- **URL:** `/api/agents`
- **Body:**
  ```json
  {
    "name": "Cửa hàng Minh",
    "phone": "0987654321",
    "address": "123 Đường ABC, Quận 1",
    "email": "minh@example.com",
    "districtId": 1,
    "agentTypeId": 1
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Create agent",
    "data": {
      "id": 1,
      "name": "Cửa hàng Minh",
      "phone": "0987654321",
      "address": "123 Đường ABC, Quận 1",
      "email": "minh@example.com",
      "debtAmount": "0.00",
      "districtId": 1,
      "agentTypeId": 1,
      "ownerId": 1,
      "isDeleted": false,
      "createdAt": "2024-01-02T...",
      "updatedAt": "2024-01-02T..."
    }
  }
  ```

---

#### 2. Get All Agents - Lấy danh sách đại lý

- **Method:** `GET`
- **URL:** `/api/agents`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get all agents",
    "data": [
      {
        "id": 1,
        "name": "Cửa hàng Minh",
        "phone": "0987654321",
        "address": "123 Đường ABC, Quận 1",
        "email": "minh@example.com",
        "debtAmount": "5000.00",
        "districtId": 1,
        "agentTypeId": 1,
        "ownerId": 1,
        "isDeleted": false,
        "createdAt": "2024-01-02T...",
        "updatedAt": "2024-01-02T..."
      }
    ]
  }
  ```

---

#### 3. Get Agent by ID - Lấy chi tiết đại lý

- **Method:** `GET`
- **URL:** `/api/agents/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get agent by id",
    "data": {
      "id": 1,
      "name": "Cửa hàng Minh",
      "phone": "0987654321",
      "address": "123 Đường ABC, Quận 1",
      "email": "minh@example.com",
      "debtAmount": "5000.00",
      "districtId": 1,
      "agentTypeId": 1,
      "ownerId": 1,
      "isDeleted": false,
      "createdAt": "2024-01-02T...",
      "updatedAt": "2024-01-02T..."
    }
  }
  ```

---

#### 4. Update Agent - Cập nhật đại lý

- **Method:** `PUT`
- **URL:** `/api/agents/:id`
- **Body:** (các field là tùy chọn)
  ```json
  {
    "name": "Cửa hàng Minh Phát",
    "phone": "0987654322",
    "address": "124 Đường ABC, Quận 1",
    "districtId": 2
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Update agent",
    "data": {
      /* updated agent */
    }
  }
  ```

---

#### 5. Delete Agent - Xóa đại lý

- **Method:** `DELETE`
- **URL:** `/api/agents/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Delete agent"
  }
  ```

---

#### 6. Search Agent - Tìm kiếm đại lý

- **Method:** `GET`
- **URL:** `/api/agents/search?keyword=Minh&field=name`
- **Query Parameters:**
  - `keyword` (required): Từ khóa tìm kiếm
  - `field` (required): Trường tìm kiếm (name, phone, address, email)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Search agent",
    "data": [
      /* agents found */
    ]
  }
  ```

---

#### 7. Get Top 5 Agents by Revenue - Top 5 đại lý có doanh số cao nhất

- **Method:** `GET`
- **URL:** `/api/agents/top-revenue`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get top 5 agents by revenue",
    "data": [
      {
        "agentId": 1,
        "name": "Cửa hàng Minh",
        "totalRevenue": "15000.00"
      }
    ]
  }
  ```

---

## Agent Types (Loại đại lý)

### Base URL: `/api/agent-types`

> **Yêu cầu:** JWT token

---

#### 1. Create Agent Type - Tạo loại đại lý

- **Method:** `POST`
- **URL:** `/api/agent-types`
- **Body:**
  ```json
  {
    "name": "Đại lý loại A",
    "maxDebt": "50000"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Create agent type",
    "data": {
      "id": 1,
      "name": "Đại lý loại A",
      "maxDebt": "50000.00"
    }
  }
  ```

---

#### 2. Get All Agent Types - Lấy danh sách loại đại lý

- **Method:** `GET`
- **URL:** `/api/agent-types`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get all agent types",
    "data": [
      /* agent types */
    ]
  }
  ```

---

#### 3. Get Agent Type by ID - Lấy chi tiết loại đại lý

- **Method:** `GET`
- **URL:** `/api/agent-types/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get agent type by id",
    "data": {
      "id": 1,
      "name": "Đại lý loại A",
      "maxDebt": "50000.00",
      "agents": [
        /* danh sách đại lý */
      ]
    }
  }
  ```

---

#### 4. Update Agent Type - Cập nhật loại đại lý

- **Method:** `PUT`
- **URL:** `/api/agent-types/:id`
- **Body:**
  ```json
  {
    "name": "Đại lý loại A+",
    "maxDebt": "60000"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Update agent type",
    "data": {
      /* updated agent type */
    }
  }
  ```

---

#### 5. Delete Agent Type - Xóa loại đại lý

- **Method:** `DELETE`
- **URL:** `/api/agent-types/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Delete agent type"
  }
  ```

---

#### 6. Get Agent Type Products - Lấy sản phẩm của loại đại lý

- **Method:** `GET`
- **URL:** `/api/agent-types/:id/products`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get agent type products",
    "data": {
      "id": 1,
      "name": "Đại lý loại A",
      "maxDebt": "50000.00",
      "products": [
        {
          "agentTypeId": 1,
          "productId": 1,
          "product": {
            "id": 1,
            "name": "Sản phẩm A",
            "price": "100.00"
          }
        }
      ]
    }
  }
  ```

---

#### 7. Update Agent Type Products - Cập nhật sản phẩm cho loại đại lý

- **Method:** `PUT`
- **URL:** `/api/agent-types/:id/products`
- **Body:**
  ```json
  {
    "productIds": [1, 3, 5]
  }
  ```
- **Note:** Xóa tất cả sản phẩm hiện tại và thêm các sản phẩm mới
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Update agent type products",
    "data": {
      /* updated agent type with products */
    }
  }
  ```

---

## Products (Sản phẩm)

### Base URL: `/api/products`

> **Yêu cầu:** JWT token

---

#### 1. Create Product - Tạo sản phẩm

- **Method:** `POST`
- **URL:** `/api/products`
- **Body:**
  ```json
  {
    "name": "Sản phẩm A",
    "price": "100000",
    "unitIds": [1, 2, 3],
    "agentTypeIds": [1, 2]
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Create product",
    "data": {
      "product": {
        "id": 1,
        "name": "Sản phẩm A",
        "price": "100000.00",
        "isDeleted": false,
        "createdAt": "2024-01-02T...",
        "updatedAt": "2024-01-02T..."
      },
      "units": [
        {
          "productId": 1,
          "unitId": 1,
          "unit": {
            "id": 1,
            "name": "Chiếc"
          }
        },
        {
          "productId": 1,
          "unitId": 2,
          "unit": {
            "id": 2,
            "name": "Hộp"
          }
        }
      ],
      "agentTypes": [
        {
          "productId": 1,
          "agentTypeId": 1,
          "agentType": {
            "id": 1,
            "name": "Đại lý loại A",
            "maxDebt": "100000.00"
          }
        },
        {
          "productId": 1,
          "agentTypeId": 2,
          "agentType": {
            "id": 2,
            "name": "Đại lý loại B",
            "maxDebt": "50000.00"
          }
        }
      ]
    }
  }
  ```
- **Note:**
  - `unitIds` là tùy chọn
  - `agentTypeIds` là tùy chọn
  - Nếu không gửi `unitIds` hoặc `agentTypeIds`, sẽ trả về mảng rỗng

---

#### 2. Get All Products - Lấy danh sách sản phẩm

- **Method:** `GET`
- **URL:** `/api/products`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get all products",
    "data": [
      {
        "id": 1,
        "name": "Sản phẩm A",
        "price": "100000.00"
      }
    ]
  }
  ```

---

#### 3. Get Product by ID - Lấy chi tiết sản phẩm

- **Method:** `GET`
- **URL:** `/api/products/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get product by id",
    "data": {
      "id": 1,
      "name": "Sản phẩm A",
      "price": "100000.00",
      "isDeleted": false,
      "createdAt": "2024-01-02T...",
      "updatedAt": "2024-01-02T...",
      "details": [
        /* export note details */
      ]
    }
  }
  ```

---

#### 4. Update Product - Cập nhật sản phẩm

- **Method:** `PUT`
- **URL:** `/api/products/:id`
- **Body:**
  ```json
  {
    "name": "Sản phẩm A+",
    "price": "110000",
    "unitIds": [1, 2, 3],
    "agentTypeIds": [1, 3]
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Update product",
    "data": {
      "product": {
        "id": 1,
        "name": "Sản phẩm A+",
        "price": "110000.00",
        "isDeleted": false,
        "createdAt": "2024-01-02T...",
        "updatedAt": "2024-01-02T..."
      },
      "units": [
        {
          "productId": 1,
          "unitId": 1,
          "unit": {
            "id": 1,
            "name": "Chiếc"
          }
        },
        {
          "productId": 1,
          "unitId": 2,
          "unit": {
            "id": 2,
            "name": "Hộp"
          }
        }
      ],
      "agentTypes": [
        {
          "productId": 1,
          "agentTypeId": 1,
          "agentType": {
            "id": 1,
            "name": "Đại lý loại A",
            "maxDebt": "100000.00"
          }
        },
        {
          "productId": 1,
          "agentTypeId": 3,
          "agentType": {
            "id": 3,
            "name": "Đại lý loại C",
            "maxDebt": "75000.00"
          }
        }
      ]
    }
  }
  ```
- **Note:**
  - Nếu không gửi `unitIds`, chỉ cập nhật thông tin sản phẩm
  - Nếu gửi `unitIds`, sẽ xóa tất cả đơn vị tính cũ và thêm vào các đơn vị mới
  - Nếu gửi `agentTypeIds`, sẽ xóa tất cả loại đại lý cũ và thêm vào các loại đại lý mới

---

#### 5. Get Product Units - Lấy danh sách đơn vị tính của sản phẩm

- **Method:** `GET`
- **URL:** `/api/products/:id/units`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get product units",
    "data": [
      {
        "productId": 1,
        "unitId": 1,
        "unit": {
          "id": 1,
          "name": "Chiếc"
        }
      },
      {
        "productId": 1,
        "unitId": 2,
        "unit": {
          "id": 2,
          "name": "Hộp"
        }
      }
    ]
  }
  ```

---

#### 6. Get Products by Agent Type - Lấy danh sách sản phẩm theo loại đại lý

- **Method:** `GET`
- **URL:** `/api/agent-types/:id/products`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get agent type products",
    "data": [
      {
        "id": 1,
        "name": "Sản phẩm A",
        "price": "100000.00"
      },
      {
        "id": 2,
        "name": "Sản phẩm B",
        "price": "150000.00"
      }
    ]
  }
  ```
- **Note:** Lấy tất cả sản phẩm được phép xuất cho một loại đại lý cụ thể

---

#### 7. Delete Product - Xóa sản phẩm (Soft Delete)

- **Method:** `DELETE`
- **URL:** `/api/products/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Delete product"
  }
  ```
- **Note:** Sản phẩm được đánh dấu `isDeleted = true`, không xóa vật lý. Lịch sử phiếu xuất hàng được giữ nguyên.

---

## Districts (Quận/Huyện)

### Base URL: `/api/districts`

> **Yêu cầu:** JWT token

---

#### 1. Create District - Tạo quận/huyện

- **Method:** `POST`
- **URL:** `/api/districts`
- **Body:**
  ```json
  {
    "name": "Quận 1",
    "maxAgents": 4
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Create district",
    "data": {
      "id": 1,
      "name": "Quận 1",
      "maxAgents": 4
    }
  }
  ```

---

#### 2. Get All Districts - Lấy danh sách quận/huyện

- **Method:** `GET`
- **URL:** `/api/districts`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get all districts",
    "data": [
      /* districts */
    ]
  }
  ```

---

#### 3. Get District by ID - Lấy chi tiết quận/huyện

- **Method:** `GET`
- **URL:** `/api/districts/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get district by id",
    "data": {
      "id": 1,
      "name": "Quận 1",
      "maxAgents": 4,
      "agents": [
        /* danh sách đại lý */
      ]
    }
  }
  ```

---

#### 4. Update District - Cập nhật quận/huyện

- **Method:** `PUT`
- **URL:** `/api/districts/:id`
- **Body:**
  ```json
  {
    "name": "Quận 1 - TP.HCM",
    "maxAgents": 5
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Update district",
    "data": {
      /* updated district */
    }
  }
  ```

---

#### 5. Delete District - Xóa quận/huyện

- **Method:** `DELETE`
- **URL:** `/api/districts/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Delete district"
  }
  ```

---

## Units (Đơn vị)

### Base URL: `/api/units`

> **Yêu cầu:** JWT token

---

#### 1. Create Unit - Tạo đơn vị

- **Method:** `POST`
- **URL:** `/api/units`
- **Body:**
  ```json
  {
    "name": "Thùng"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Create unit",
    "data": {
      "id": 1,
      "name": "Thùng"
    }
  }
  ```

---

#### 2. Get All Units - Lấy danh sách đơn vị

- **Method:** `GET`
- **URL:** `/api/units`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get all units",
    "data": [
      /* units */
    ]
  }
  ```

---

#### 3. Get Unit by ID - Lấy chi tiết đơn vị

- **Method:** `GET`
- **URL:** `/api/units/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get unit by id",
    "data": {
      "id": 1,
      "name": "Thùng",
      "details": [
        /* export note details */
      ]
    }
  }
  ```

---

#### 4. Update Unit - Cập nhật đơn vị

- **Method:** `PUT`
- **URL:** `/api/units/:id`
- **Body:**
  ```json
  {
    "name": "Thùng 12 lon"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Update unit",
    "data": {
      /* updated unit */
    }
  }
  ```

---

#### 5. Delete Unit - Xóa đơn vị

- **Method:** `DELETE`
- **URL:** `/api/units/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Delete unit"
  }
  ```

---

## Export Notes (Phiếu xuất hàng)

### Base URL: `/api/export-bills`

> **Yêu cầu:** JWT token

---

#### 1. Create Export Note - Tạo phiếu xuất hàng

- **Method:** `POST`
- **URL:** `/api/export-bills`
- **Body:**
  ```json
  {
    "issueDate": "2024-01-02",
    "agentId": 1,
    "details": [
      {
        "productId": 1,
        "unitId": 1,
        "quantity": 10,
        "price": "100000",
        "amount": "1000000"
      }
    ]
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Create export note",
    "data": {
      "id": 1,
      "issueDate": "2024-01-02",
      "agentId": 1,
      "ownerId": 1,
      "total": "1000000.00",
      "createdAt": "2024-01-02T...",
      "updatedAt": "2024-01-02T..."
    }
  }
  ```
- **Note:** `remainingDebt` được lưu trong phiếu thu tiền, không phải phiếu xuất hàng

---

#### 2. Get All Export Notes - Lấy danh sách phiếu xuất hàng

- **Method:** `GET`
- **URL:** `/api/export-bills`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get all export notes",
    "data": [
      {
        "id": 1,
        "issueDate": "2024-01-02",
        "total": "1000000.00",
        "createdAt": "2024-01-02T...",
        "updatedAt": "2024-01-02T...",
        "agent": {
          "id": 1,
          "name": "Nguyễn Văn A",
          "phone": "0912345678"
        }
      }
    ]
  }
  ```

---

#### 3. Get Export Note by ID - Lấy chi tiết phiếu xuất hàng

- **Method:** `GET`
- **URL:** `/api/export-bills/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get export note by id",
    "data": {
      "id": 1,
      "issueDate": "2024-01-02",
      "total": "1000000.00",
      "createdAt": "2024-01-02T...",
      "updatedAt": "2024-01-02T...",
      "agent": {
        "id": 1,
        "name": "Nguyễn Văn A"
      },
      "details": [
        {
          "exportNoteId": 1,
          "productId": 1,
          "unitId": 1,
          "quantity": 10,
          "price": "100000.00",
          "amount": "1000000.00",
          "product": {
            "id": 1,
            "name": "Sản phẩm A"
          },
          "unit": {
            "id": 1,
            "name": "Chiếc"
          }
        }
      ]
    }
  }
  ```

---

## Receipts (Phiếu thu tiền)

### Base URL: `/api/receipts`

> **Yêu cầu:** JWT token

---

#### 1. Create Receipt - Tạo phiếu thu tiền

- **Method:** `POST`
- **URL:** `/api/receipts`
- **Body:**
  ```json
  {
    "payDate": "2024-01-02",
    "amount": "500000",
    "agentId": 1
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Create receipt",
    "data": {
      "id": 1,
      "payDate": "2024-01-02",
      "amount": "500000.00",
      "remainingDebt": "4500000.00",
      "agentId": 1,
      "ownerId": 1,
      "createdAt": "2024-01-02T...",
      "updatedAt": "2024-01-02T..."
    }
  }
  ```
- **Note:** `remainingDebt` là số nợ còn lại của đại lý **sau** khi phiếu thu này được tạo

---

#### 2. Get All Receipts - Lấy danh sách phiếu thu tiền

- **Method:** `GET`
- **URL:** `/api/receipts`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get all receipts",
    "data": [
      {
        "id": 1,
        "payDate": "2024-01-02",
        "amount": "500000.00",
        "remainingDebt": "4500000.00",
        "createdAt": "2024-01-02T...",
        "updatedAt": "2024-01-02T...",
        "agent": {
          "id": 1,
          "name": "Nguyễn Văn A",
          "phone": "0912345678",
          "debtAmount": "4500000.00"
        }
      }
    ]
  }
  ```

---

#### 3. Get Receipt by ID - Lấy chi tiết phiếu thu tiền

- **Method:** `GET`
- **URL:** `/api/receipts/:id`
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Get receipt by id",
    "data": {
      "id": 1,
      "payDate": "2024-01-02",
      "amount": "500000.00",
      "remainingDebt": "4500000.00",
      "agentId": 1,
      "ownerId": 1,
      "createdAt": "2024-01-02T...",
      "updatedAt": "2024-01-02T...",
      "agent": {
        "id": 1,
        "name": "Nguyễn Văn A",
        "debtAmount": "4500000.00"
      }
    }
  }
  ```

---

## Error Handling

Tất cả các lỗi sẽ được trả về với status code phù hợp:

- **400 Bad Request:** Dữ liệu không hợp lệ
- **404 Not Found:** Không tìm thấy resource
- **500 Internal Server Error:** Lỗi server

**Response lỗi:**

```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "statusCode": 400
}
```

---

## Reports (Báo cáo)

### Base URL: `/api/reports`

> **Yêu cầu:** JWT token

---

#### 1. Get Sales Report (BM5.1) - Báo cáo doanh số

- **Method:** `GET`
- **URL:** `/api/reports/sales?month=1&year=2024`
- **Query Parameters:**
  - `month` (required): Tháng (1-12)
  - `year` (required): Năm
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Báo cáo doanh số (BM5.1)",
    "data": {
      "month": 1,
      "year": 2024,
      "totalRevenue": 5000000,
      "salesData": [
        {
          "agentId": 1,
          "agentName": "Cửa hàng Minh",
          "billCount": 10,
          "totalRevenue": 1500000,
          "percentage": 30.0
        },
        {
          "agentId": 2,
          "agentName": "Cửa hàng An",
          "billCount": 8,
          "totalRevenue": 2000000,
          "percentage": 40.0
        }
      ]
    }
  }
  ```
- **Mô tả:**
  - **STT:** Số thứ tự
  - **Đại Lý:** Tên đại lý
  - **Số Phiếu Xuất:** Số lượng phiếu xuất trong tháng
  - **Tổng Trị Giá:** Tổng giá trị xuất hàng
  - **Tỷ Lệ:** Tỷ lệ % doanh số so với tổng cộng

---

#### 2. Get Debt Report (BM5.2) - Báo cáo công nợ

- **Method:** `GET`
- **URL:** `/api/reports/debt?month=1&year=2024`
- **Query Parameters:**
  - `month` (required): Tháng (1-12)
  - `year` (required): Năm
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Báo cáo công nợ (BM5.2)",
    "data": {
      "month": 1,
      "year": 2024,
      "debtData": [
        {
          "agentId": 1,
          "agentName": "Cửa hàng Minh",
          "beginningDebt": 1000000,
          "issuedDebt": 500000,
          "payment": 300000,
          "endingDebt": 1200000
        },
        {
          "agentId": 2,
          "agentName": "Cửa hàng An",
          "beginningDebt": 2000000,
          "issuedDebt": 1000000,
          "payment": 500000,
          "endingDebt": 2500000
        }
      ]
    }
  }
  ```
- **Mô tả:**
  - **STT:** Số thứ tự
  - **Đại Lý:** Tên đại lý
  - **Nợ Đầu:** Nợ đầu kỳ (tính từ nợ cuối kỳ tháng trước)
  - **Phát Sinh Nợ:** Tổng giá trị phiếu xuất trong tháng
  - **Thanh Toán:** Tổng tiền thu (thanh toán) trong tháng
  - **Nợ Cuối:** Nợ cuối kỳ (nợ hiện tại)

---

#### 3. Get Summary Report - Báo cáo tổng hợp

- **Method:** `GET`
- **URL:** `/api/reports/summary?month=1&year=2024`
- **Query Parameters:**
  - `month` (required): Tháng (1-12)
  - `year` (required): Năm
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Báo cáo tổng hợp",
    "data": {
      "month": 1,
      "year": 2024,
      "salesReport": {
        /* như BM5.1 */
      },
      "debtReport": {
        /* như BM5.2 */
      }
    }
  }
  ```

---

## Notes

- Tất cả API (trừ login, register) yêu cầu JWT token trong header: `Authorization: Bearer {token}`
- Sản phẩm sử dụng Soft Delete (không xóa vật lý)
- Agent dùng `isDeleted` flag để xóa mềm
- Phiếu xuất hàng và phiếu thu tiền được lưu trữ vĩnh viễn để bảo toàn lịch sử
- Loại đại lý có thể chứa nhiều sản phẩm thông qua bảng `AgentTypeProduct`
- Báo cáo doanh số và công nợ được tính dựa trên dữ liệu phiếu xuất hàng và phiếu thu tiền theo tháng
