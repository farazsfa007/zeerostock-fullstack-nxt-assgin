# ZeeroStock Fullstack Assignment

This repository contains the complete solution for the ZeeroStock developer assignment, featuring an Inventory Search UI/API and an Inventory Database API.

## Live Deployments & Links
* **GitHub Repository:** [farazsfa007/zeerostock-fullstack-nxt-assgin](https://github.com/farazsfa007/zeerostock-fullstack-nxt-assgin)
* **Frontend UI (Search):** [Live Site](https://zeerostock-fullstack-nxt-assgin-ui.onrender.com)
* **Backend API (Search):** [Live API](https://zeerostock-fullstack-nxt-assgin-1.onrender.com)
* **Backend API (Database):** [Live API](https://zeerostock-fullstack-nxt-assgin.onrender.com)

---

## Part A: Inventory Search API + UI
This section allows buyers to search surplus inventory across multiple suppliers using a static dataset.

### Search Logic Explanation
The `/search` API endpoint processes requests against an in-memory array of inventory items. 
* **Filtering:** It sequentially applies filters based on the provided query parameters (`q`, `category`, `minPrice`, `maxPrice`). If multiple filters are provided, they are combined, and an item must match *all* conditions to be returned.
* **Partial & Case-Insensitive Match:** For the product name (`q`), the logic converts both the search query and the stored product names to lowercase and uses a partial matching check (`.includes()`).
* **Edge Cases:** Empty search queries are ignored (bypassing that specific filter), and if the `minPrice` is greater than the `maxPrice`, the API rejects the request with a `400 Bad Request`. If no items match, it returns an empty array, prompting the UI to display a "No results found" state.

### Performance Improvement for Large Datasets
**Implement Pagination:** Currently, the API returns the entire filtered dataset in a single JSON response. For large datasets, this would consume significant server memory and slow down frontend rendering. By adding `limit` and `offset` (or `page`) query parameters, the backend could return data in manageable chunks (e.g., 20 items per request), greatly improving load times and system efficiency.

---

## Part B: Inventory Database + APIs
This section implements a database system for suppliers to list surplus stock, enforcing strict data validation.

### Database Schema Explanation
The database is built using MongoDB (via Mongoose) and consists of two collections:
* **`Suppliers` Collection:** Stores the supplier's `name` and `city`.
* **`Inventory` Collection:** Stores the `product_name`, `quantity`, and `price`. It establishes a one-to-many relationship by storing a `supplier_id` (ObjectId) referencing the specific supplier. 
* **Validation Rules:** Mongoose schema validators enforce that `quantity` is $\ge 0$ and `price` is $> 0$.

### Why NoSQL (MongoDB)?
I chose MongoDB (NoSQL) with Mongoose because:
1. **Validation & Flexibility:** Mongoose makes it easy to enforce strict validation rules directly at the schema level without writing cumbersome manual checks in the API controllers.
2. **Powerful Aggregation:** The assignment required a query to return inventory grouped by supplier and sorted by total inventory value (quantity $\times$ price). MongoDB's Aggregation Pipeline (`$lookup`, `$group`, `$sum`, `$multiply`) handles this complex, grouped calculation highly efficiently without needing raw SQL joins.

### Indexing & Optimization Suggestion
**Index the `supplier_id` field:** In the `Inventory` collection, the system relies heavily on matching items to their parent supplier. As the dataset grows, joining or grouping inventory by supplier will require full-collection scans. Adding an index to the `supplier_id` foreign key will turn these into fast, targeted lookups, significantly optimizing the performance of the aggregation query and any future supplier-specific searches.