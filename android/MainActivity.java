package com.example.dawame;

import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Environment;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.PackageManagerCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.journeyapps.barcodescanner.ScanContract;
import com.journeyapps.barcodescanner.ScanOptions;
import android.view.View;
import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Scanner;

import android.Manifest;



public class MainActivity extends AppCompatActivity {
    String appPath="/DaWaMe";
    Button storeButton;
    Button get_button,post_button;
    TextView request_result;
    private StringRequest getRequest,postRequest;
    private RequestQueue requestQueue;

    Button scan_button;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        ActivityCompat.requestPermissions(this,
                new String[] {Manifest.permission.READ_EXTERNAL_STORAGE,Manifest.permission.WRITE_EXTERNAL_STORAGE,Manifest.permission.MANAGE_EXTERNAL_STORAGE},PackageManager.PERMISSION_GRANTED);

        storeButton=findViewById(R.id.store);
        storeButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                writeFile("hello world i am happy");
            }
        });
        get_button=findViewById(R.id.get_button);
        get_button.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                getRequest();
            }
        });
        post_button=findViewById(R.id.post_button);
        post_button.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                postRequest();
            }
        });
        request_result=findViewById(R.id.result);
        requestQueue=Volley.newRequestQueue(MainActivity.this);




        scan_button=findViewById(R.id.scan_button);
        scan_button.setOnClickListener(v->{scanCode();});
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void scanCode() {
        ScanOptions options=new ScanOptions();
        options.setPrompt("volume up to flash");
        options.setBeepEnabled(false);
        options.setOrientationLocked(false);
        options.setCaptureActivity(CaptureAct.class);
        barLauncher.launch(options);
    }
    ActivityResultLauncher<ScanOptions> barLauncher=registerForActivityResult(new ScanContract(), result->{
        if(result.getContents()!=null){
            AlertDialog.Builder builder=new AlertDialog.Builder(MainActivity.this);

            builder.setTitle("Result");
            int res=processContent(result.getContents());
            if(res!=0){
                builder.setMessage(result.getContents());
            }
            else {
                builder.setMessage("done successfully");
            }
            builder.setPositiveButton("OK",new DialogInterface.OnClickListener(){
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    dialogInterface.dismiss();
                }
            }).show();
        }
    });
    int processContent(String s){

        return 1;
    }
    void getRequest(){
        String url="https://simplifiedcoding.net/demos/marvel";
        getRequest= new StringRequest(Request.Method.GET,url,
                new Response.Listener<String>(){
                    @Override
                    public void onResponse(String response) {
                        request_result.setText(response);
                    }
                }
                ,new Response.ErrorListener(){
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        request_result.setText("ERROR");
                    }
                });
        getRequest.setTag("getRequest");
        requestQueue.add(getRequest);
    }
    void postRequest(){
        String url="https://reqres.in/api/users";
        String requestBody;
        try{
            JSONObject jsonBody=new JSONObject();
            jsonBody.put("name","it wala");
            requestBody=jsonBody.toString();
            postRequest=new StringRequest(Request.Method.POST,url,
                    new Response.Listener<String>(){
                        @Override
                        public void onResponse(String response) {
                            request_result.setText(response);
                        }
                    },
                    new Response.ErrorListener(){
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            request_result.setText("POST ERROR"+error.toString());
                        }
                    }
                    );
            postRequest.setTag("postRequest");
            requestQueue.add(postRequest);
        }catch(JSONException e){
            e.printStackTrace();
        }
    }

    protected void onStop(){
        if(requestQueue!=null){
            requestQueue.cancelAll("getRequest");
            requestQueue.cancelAll("postRequest");
        }
        super.onStop();
    }

    private boolean isExternalStorageWriteable(){
        return Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState());
    }
    public void writeFile(String text){
        File path=getApplicationContext().getFilesDir();
        try {

            Scanner sc=new Scanner(new File(path+"/out.txt"));
            String s="";
            while(sc.hasNextLine()){
                s=s+sc.nextLine();
            }
            sc.close();
            request_result.setText("DONE!"+s);
            FileOutputStream writer=new FileOutputStream(new File(path+"/out.txt"));
            writer.write(text.getBytes());

        } catch (FileNotFoundException e) {
            request_result.setText("file not found");
            throw new RuntimeException(e);
        } catch (IOException e) {
            request_result.setText("ioexception");
            throw new RuntimeException(e);
        }
    }
    public boolean checkPermissions(String permission){
        return ContextCompat.checkSelfPermission(this,permission)==PackageManager.PERMISSION_GRANTED;
    }
}