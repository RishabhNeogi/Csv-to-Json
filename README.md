
# CSV to Database Processor

This Node.js application processes CSV files and inserts the data into a PostgreSQL database. It also calculates the age distribution of the users and prints a report.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- PostgreSQL

## Setup

1. Clone this repository to your local machine:



## Running Tests

1. To run tests, run the following command

```bash
 git clone <repository-url>
```
2. Navigate to the project directory:

```bash
cd csv-to-database-processor
```
3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
CSV_FILE_PATH=./data.csv
```
Replace username, password, and database_name with your PostgreSQL credentials and database name. Also, ensure that the CSV_FILE_PATH points to the location of your CSV file.


## Usage

To run the application, execute the following command:

```bash
npm start
```

This will start the server, process the CSV file, insert the data into the database, calculate the age distribution, and print the report.



