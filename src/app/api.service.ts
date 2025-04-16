import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

//Test interface for structure of a relation in the DB
export interface DataItem {
  id?: number;
  column1?: string;
  column2?: string;
}

//Makes available as a service throughout the entire app
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //Points to my PHP backend. Dont quite know yet how to have it host individual DB's... I think just using mine should work?
  private apiUrl = 'https://www.cs.colostate.edu/~bscheidt/api.php';

  //HttpClient is injected via the constructor, giving http functionality
  constructor(private http: HttpClient) {}

  //Makes a GET request to the PHP backend. Currently set up to use test table called 'default_table'
  getData(target: string = 'default_table', count: number = 10): Observable<DataItem[]> {
    //Build the http GET parameters from passed in arguments
    const params = new HttpParams().set('target', target).set('count', count.toString());
    //Perform GET request and return a JSON object
    return this.http.get<DataItem[]>(this.apiUrl, { params });
  }

  //Makes a POST request to the PHP backend. Currently just posts test data for 2 columns of a relation
  postData(target: string, data: { column1: string; column2: string }): Observable<any> {
    //Template string for constructing URL POST request parameters
    const url = `${this.apiUrl}?target=${target}`;
    //Set http options to have JSON type content in the POST request
    const options = {headers: {'Content-Type': 'application/json'}};
    //Perform POST request, passing in the url and the JSON payload and content header
    return this.http.post(url, JSON.stringify(data), options);
  }
}

//This is my PHP backend since you all dont have access to it in the repo. I am hosting it in my public_html folder and called it api.php

/* <?php
    //Set headers for CORS and JSON response
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');
    header('Content-Type: application/json');

    //Handle OPTIONS preflight requests by returning allowed methods
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        http_response_code(200);
        exit();
    }

    //DB connection parameters
    $servername = "faure";
    $username   = "bscheidt";
    $password   = "MY_PASSWORD";
    $db         = "bscheidt";

    //Connect to the DB on faure
    $conn = new mysqli($servername, $username, $password, $db);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
        exit();
    }

    //Determine http request method and set default GET parameters if not provided
    $method = $_SERVER['REQUEST_METHOD'];
    $target = isset($_GET['target']) ? $_GET['target'] : "default_table";
    $count  = isset($_GET['count'])  ? intval($_GET['count']) : 10;

    //Handle GET request
    if ($method === 'GET') {
        //construct select query from DB with a limit of 10 by default
        $query = "SELECT * FROM {$target} LIMIT {$count}";
        $result = $conn->query($query);
        $data = array();
        //For all rows of returned query, store as element in an array
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        //turn the PHP array into a JSON object and return that
        echo json_encode($data);

    //Handle POST request
    } else if ($method === 'POST') {
        //Decode the JSON given by the request
        $input = json_decode(file_get_contents("php://input"), true);

        //store in variables the request columns. These are placeholders for testing.
        $column1 = $input['column1'];
        $column2 = $input['column2'];

        //Construct INSERT query into target table
        $query = "INSERT INTO {$target} (column1, column2) VALUES ('{$column1}', '{$column2}')";
        //if successful
        if ($conn->query($query)) {
            //return http 201 response
            http_response_code(201);
            //debug print success
            echo json_encode(["success" => "Record inserted"]);
        //if error
        } else {
            //return http 400 response
            http_response_code(400);
            //debug print error and set the DB connection to have an error
            echo json_encode(["error" => "Insert failed: " . $conn->error]);
        }
    //if request not a GET or POST request
    } else {
        //set http response to 405
        http_response_code(405);
        //debug print error without setting DB connection to error state
        echo json_encode(["error" => "Method not allowed"]);
    }
    //End DB connection gracefully
    $conn->close();
?> */