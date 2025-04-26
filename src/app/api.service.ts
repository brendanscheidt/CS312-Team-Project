import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

//Test interface for structure of a relation in the DB
export interface Color {
  name: string;
  hex_value: string;
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
  getData(target: string = 'colors', count: number = 10): Observable<Color[]> {
    //Build the http GET parameters from passed in arguments
    const params = new HttpParams().set('target', target).set('count', count.toString());
    //Perform GET request and return a JSON object
    return this.http.get<Color[]>(this.apiUrl, { params });
  }

  //Makes a POST request to the PHP backend
  postData(target: string, data: { name: string; hex_value: string }): Observable<any> {
    //Template string for constructing URL POST request parameters
    const url = `${this.apiUrl}?target=${target}`;
    //Set http options to have JSON type content in the POST request
    const options = {headers: {'Content-Type': 'application/json'}};
    //Perform POST request, passing in the url and the JSON payload and content header
    console.log(url)
    console.log(JSON.stringify(data))
    console.log(options)
    return this.http.post(url, JSON.stringify(data), options);
  }

  deleteData(target: string, name: string): Observable<any> {
    const params = new HttpParams().set('target', target).set('name', name);
    return this.http.delete(this.apiUrl, { params });
  }

  putData(target: string, payload: { old_name: string; name: string; hex_value: string }): Observable<any> {
    const url = `${this.apiUrl}?target=${target}`;
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.put(url, JSON.stringify(payload), options);
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
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        http_response_code(200);
        exit();
    }

    //DB connection parameters
    $servername = "faure";
    $username   = "bscheidt";
    $password   = "830306212";
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
    $target = isset($_GET['target']) ? $_GET['target'] : "colors";
    $count  = isset($_GET['count'])  ? intval($_GET['count']) : 10;

    //Handle GET request
    if ($method === 'GET') {
        //construct select query from DB with a limit of 10 by default
        $query = "SELECT * FROM {$target}";
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
        $name = $input['name'];
        $hex_value = $input['hex_value'];

        //Construct INSERT query into target table
        $query = "INSERT INTO {$target} (name, hex_value) VALUES ('{$name}', '{$hex_value}')";
        //if successful
        if ($conn->query($query)) {
            //return http 201 response
            http_response_code(201);
            //debug print success
            echo json_encode(["success" => "Record inserted"]);
        //if error
        } else {
        // Check for duplicate‑entry error code
            if ($conn->errno === 1062) {
                http_response_code(409);
                echo json_encode(["error" => "Duplicate entry: that color already exists"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Insert failed: " . $conn->error]);
            }
        }
    } else if ($method === 'DELETE') {

        $name = isset($_GET['name']) ? $_GET['name'] : '';

        // Construct and execute the DELETE query
        $query = "DELETE FROM {$target} WHERE name = '{$name}'";
        if ($conn->query($query)) {
            http_response_code(200);
            echo json_encode(["success" => "Record deleted"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Delete failed: " . $conn->error]);
        }
    } else if ($method === 'PUT') {
        $input = json_decode(file_get_contents("php://input"), true);

        $old_name = $input['old_name'];
        $name = $input['name'];
        $hex_value = $input['hex_value'];

        $query = "UPDATE {$target} SET name = '{$name}', hex_value = '{$hex_value}' WHERE name = '{$old_name}'";

        if ($conn->query($query)) {
            //return http 201 response
            http_response_code(201);
            //debug print success
            echo json_encode(["success" => "Record updated"]);
        //if error
        } else {
            if ($conn->errno === 1062) {
                http_response_code(409);
                echo json_encode(["error" => "Duplicate entry: that color already exists"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Insert failed: " . $conn->error]);
            }
        }
    //if request not a GET, POST, PUT, or DELETE request
    } else {
        //set http response to 405
        http_response_code(405);
        //debug print error without setting DB connection to error state
        echo json_encode(["error" => "Method not allowed"]);
    }
    //End DB connection gracefully
    $conn->close();
?>
 */