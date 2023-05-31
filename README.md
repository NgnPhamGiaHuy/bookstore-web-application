<h1 align="center">Online-Bookstore-Project</h1>

The design and implementation phase of the Online Bookstore project focuses on creating an intuitive user interface, developing a scalable database schema, and establishing a modular system architecture. These decisions are necessary to ensure a smooth user experience, efficient data management, and flexible system maintenance. This section will provide detailed insights into each aspect of the design and implementation process.

5.1  Use Case:

Before diving into the details of user interface design, it is essential to understand the main use cases of the Online Bookstore project. The following key use cases were identified and considered during the design and implementation phase:

<img width="1166" alt="O B-Usecase" src="https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/36b638b2-8398-4e24-a2e1-ed2733fe8d07">
<p align="center">Figure 5 – 1 Use Case Diagram</p>

User registration and login:

•	Users can create new accounts by providing their personal information and creating a username and password.
•	Existing users can sign in with their credentials to access features and personalized account information.

Search and browse books:

•	Users can search for books based on various criteria such as book title, author, genre or publication date.
•	Users can browse book categories and genres to discover new titles that interest them.

Book details and reviews:

•	Users can view detailed information about specific books, including book cover, title, author, genre, description, and customer reviews.
•	Users can read and contribute comments to share their opinions and experiences with the community.

Cart management:

•	Users can add books to their cart, update quantities, and remove items as needed.
•	Users can view the contents of their cart, including the total price, and proceed to checkout.

Check and pay:

•	Users can proceed to the checkout process, where they provide shipping information and choose a payment method.
•	Integration with secure payment gateway allows users to complete transactions securely.

Order history and tracking:

•	Users can track the status of their orders, including shipment details and estimated delivery dates.
•	Users can view their order history and access receipts for previous purchases.

Manage user accounts:

•	Users can manage their account information, including updating personal information, changing passwords, and managing email preferences.
•	Users can view and edit billing and shipping addresses for faster payments in the future.

Now that we've outlined the main use cases, let's dive into the Database design and UI design of the Online Bookstore project.

5.2  Database Schema
The database schema for the Online Bookstore project is carefully designed to efficiently manage book-related data and user information. MongoDB, a popular NoSQL database, is used in conjunction with the Mongoose library to facilitate interaction with the database.

The schema includes several collections like "Book", "Author", "Genre", "Publisher", "Book Author", "Book Genre", "Book Publisher", "Cart", "Cart Item", "Customer" and "Review." Each collection represents a distinct entity in the system and contains related fields to store related data. Relationships between collections are established using primary and foreign keys, ensuring data integrity.

For example, the "Books" collection stores information about each book, including title, description, price, availability, and references to respective authors, genres, and publishers. The "Author", "Genre", and "Publisher" collections contain details about the respective entities, such as names and biographies. The "Book Author", "Book Genre", and "Book Publisher" collections facilitate mapping between books and related authors, genres, and publishers.

To optimize performance, proper indexing has been implemented on frequently accessed columns. Indexing enhances query performance by allowing the database to quickly locate the desired data. In addition, security measures, such as hashing and generation of user passwords, have been used to protect sensitive user information stored in the "Customer" collection.
 
<img width="998" alt="O B-ERD" src="https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/1594d786-d43d-4f99-b43e-eef09f3c5241">
Figure 5 – 2 ERD Diagrams

5.3  User Interface Design
The UI design of Online Bookstore aims to provide a clean and visually appealing layout to enhance the overall user experience. The design team focused on creating a responsive interface that can be accessed seamlessly from a variety of devices and screen sizes. Key design elements, such as a prominent search bar, clear navigation menus, and streamlined book catalogs, have been incorporated to facilitate easy book discovery and browsing.

The HomePage serves as a central hub, providing users with an overview of featured books, suggested titles, and personalized recommendations based on their browsing history. The design emphasizes the importance of prominently displaying book covers, titles, authors and ratings. Users can easily navigate to different sections of the website, such as ShopPage, CartPage, LoginPage, RegisterPage, CheckOutPage and BookPage, using well-designed navigation menus.

To simplify the buying experience, a user-friendly shopping cart has been implemented. Users can add books to their cart, update quantities, and proceed to checkout seamlessly. The checkout process is streamlined, allowing users to provide shipping information, choose a payment method, and review their order before completing a purchase. Clear and concise error messages are displayed whenever necessary to guide the user through the process.

5.3.1   Login & Register Interface Design:
The login and register interface of the online bookstore web application provides users with a secure and convenient way to access the platform and enjoy its features:

Login Interface:
The login interface allows registered users to log into their accounts. It consists of two input fields: one for the user's email or username and another for their password. Upon entering the correct credentials, users can click the login button to access their personalized bookstore account.

![LoginPage](https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/fd1789c7-4c90-4cb4-9436-7e61a9557861)
Figure 5 – 3 Login Interface Design

Register Interface:
The register interface enables new users to create an account on the online bookstore platform. It prompts users to provide their necessary information, including a valid email address, a unique username, and a secure password. Once users fill in the required fields, they can submit the registration form and create their account. The interface also include terms of service or privacy policy agreement checkboxes to ensure users are aware of and agree to the platform's policies.

![RegisterPage](https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/2ed83bef-3cb4-4bf4-8cd6-256f13c7059c)
Figure 5 – 4 Regiter Interface Desgin


5.3.2   Home Page Interface Design
The home page of an online bookstore web application serves as the primary gateway for users to explore and discover a wide range of books and related content:

Header: The top section of the home page contains a header that includes the application's logo, navigation menu, and search bar. The logo helps users identify the bookstore brand, while the navigation menu allows them to access different sections of the website, such as shop, publisher, author, or contact. The search bar enables users to quickly search for specific books or authors.

Book Categories or Genres: A prominent section on the home page showcases various book categories or genres. This allows users to browse books based on their interests or preferred genres, such as fiction, non-fiction, mystery, romance, sci-fi, etc. Each category may display a selection of book covers or titles to give users a glimpse of what they can expect in that genre.

Featured Content: The home page highlights featured books or book recommendations to catch users' attention. This section includes visually appealing book covers, catchy taglines, and brief descriptions to entice users to explore further.

Reviews: To build trust and credibility, the homepage includes book reviews from users who have purchased previously. This can help users make an informed decision about their book selection and increase their confidence when purchasing from a bookstore.
 

Figure 5 – 5 Home Page Interface Design

5.3.3   Shop Page Interface Desgin
The shop page of an online bookstore web application is a crucial section where users can browse, search, and purchase books from a vast collection:

Search and Filters: The shop page includes a search bar and filters to help users find specific books or refine their search results. The search bar allows users to enter keywords, book titles, or author names to quickly locate desired books. Filters, such as genre, or author, enable users to narrow down their search based on their preferences.

Book Listings: The primary section of the shop page displays a grid or list of book listings. Each listing includes the book cover image, title, author, price, and average rating. Users can click on a book to view more details or add it to their shopping cart for purchase.

Sorting Options: To enhance user experience, the shop page provides sorting options. Users can choose to sort the book listings by relevance, popularity, price (low to high or high to low), publication date, or customer ratings. This helps users find books that align with their preferences and priorities.

Book Details: Clicking on a book from the shop page takes users to a dedicated book details page. This page provides comprehensive information about the book, including a larger book cover image, detailed description, author information, publication details, and customer reviews. Users can also find options to add the book to their cart, add it to their wish list, or write their own review.

Shopping Cart: The shop page features a shopping cart icon that displays the number of items in the user's cart. Users can easily review and edit their selected items before proceeding to the checkout process.

Figure 5 – 6 Shop Page Interface Desgin

5.3.4   Book Page Interface Design
The book page on an online bookstore web application is a dedicated space where users can access comprehensive information about a specific book:

Book Cover and Title: The book page prominently showcases the book's cover image and title at the left and top. The cover image allows users to visually connect with the book, while the title provides a clear identification.

Book Details: Below the title, the book page presents detailed information about the book. This includes the author's name, genre, publisher, SKU, and any relevant edition details. Users can easily refer to these details for reference or verification.

Book Description: A substantial section of the book page provides a comprehensive description of the book. This description offers users an overview of the book's plot, genre, theme, or any other relevant information that helps them understand the content and decide if it aligns with their interests.

Customer Reviews and Ratings: To assist users in making informed decisions, the book page may display customer reviews and ratings. These reviews are accompanied by a star rating that represents the average score given by readers who have already experienced the book. Users can read through the reviews to gain insights and opinions from other readers.
 
![BookPage](https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/ddc45192-5a79-4e62-ae60-f663831ee18c)
Figure 5 – 7 Book Page Interface Design

5.3.5   Search Page Interface Design
The search page of an online bookstore web application provides users with a powerful tool to discover specific books or explore a wide range of options based on their search criteria:

Search Bar: The search page prominently features a search bar where users can enter keywords, book titles, author names, or any other relevant information to initiate a search.

Search Results: Upon entering a search query, the search page displays a list of relevant search results. Each search result includes the book cover image, title, author, price, and customer review. Users can click on a specific book to access its dedicated book page for more detailed information.

Filters and Sorting Options: The search page provides filters and sorting options to help users narrow down their search results. Filters include options such as price range, publication date, or customer ratings. Sorting options allow users to rearrange the search results based on relevance, popularity, price, or customer ratings.

Pagination: If the search results are extensive, the search page implement pagination to ensure a smooth browsing experience.

![SearchPage](https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/deb472fa-9b99-46fa-8cbe-b814ac2b2401)
Figure 5 – 8.1 Seacrh Page Interface Design with “Harry” keyword


Figure 5 – 8.1 Seacrh Page Interface Design with “A” keyword

5.3.6   Cart Page Interface Design
The cart page of an online bookstore web application is a crucial stage in the purchasing process, where users can review and manage the items, they have added to their shopping cart before proceeding to checkout:

Cart Summary: The cart page displays a summary section at the top, providing an overview of the items currently in the user's cart. This section includes details such as the book titles, quantities, prices, and the total cost of the items in the cart.

Quantity Adjustment: The cart page allows users to adjust the quantity of each item in their cart. Users can increase or decrease the quantity using plus and minus buttons. This feature provides flexibility for users to manage the number of items they wish to purchase.

Remove Items: Users can easily remove items from their cart if they decide not to proceed with the purchase. The cart page includes a "delete" button next to the left of each item, allowing users to remove specific items from their cart with a single click.

Cart Subtotal and Total: The cart page displays the subtotal, which represents the total cost of the items in the cart before any additional fees or discounts. It also presents the total cost, which includes any applicable taxes, shipping charges, or discounts. These figures help users understand the financial aspects of their purchase before proceeding to checkout.

Proceed to Checkout: The cart page includes a prominent "Proceed to checkout" button that allows users to initiate the checkout process. Clicking this button takes users to the payment and shipping information page, where they can provide the necessary details to complete their purchase.

![CartPage-HaveBooks](https://github.com/HinhNhuLaHuy/Online-Bookstore-Project/assets/84061230/03d7da9d-b50c-401a-b695-74677e46df91)
Figure 5 – 9 Cart Page Interface Design with Books
