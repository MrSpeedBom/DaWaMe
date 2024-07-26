package com.example.dawame;

import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.NonNull;
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
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.util.Scanner;

import android.Manifest;
import org.json.*;



public class MainActivity extends AppCompatActivity {
    String appPath="/DaWaMe";
    Button storeButton;
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
    String gt(String x){
        String r="";
        for(int i=1;i<x.length();i++)r=r+x.charAt(i);
        return r;
    }
    int processContent(String s) {
        Scanner sc=new Scanner(s);
        String line;
        if(!sc.hasNextLine())return 1;
        else
        line=sc.nextLine();
        cipher(line,"DaWaMe");
        line=gt(line);
        Log.d("dep",line);
        Log.d("dep", String.valueOf((line.length())));
        if(!line.equals("dawame"))return 1;
        else Log.d("dep","equals dawame");

        String arr[]=new String[]{"NAME","MNAME","LNAME","PHONE_NUMBER","NATIONAL_NUMBER","GENDER","ip","port"};
        int i=0;
        JSONObject js=new JSONObject();

        while(sc.hasNextLine()){
            line=sc.nextLine();
            cipher(line,"DaWaMe");
            try{
                Log.d("json",arr[i]);
                Log.d("json",line);
                js.put(arr[i],line);
            }catch (JSONException e){
                e.printStackTrace();
            }
            i++;
        }
        try {
            //getRequest("https://" + js.get("ip") + ":"+js.get("port")+"/local_ip");
            postRequest("http://" + js.get("ip") + ":"+js.get("port")+"/signup",js);
        }catch(JSONException e){
            e.printStackTrace();
        }
        return 0;
    }
    void getRequest(String url){
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
                        request_result.setText(error.toString());
                    }
                });
        getRequest.setTag("getRequest");
        requestQueue.add(getRequest);
    }
    void postRequest(String url,JSONObject jsonBody){
        Log.d("dep",url);
        String requestBody;
        requestBody=jsonBody.toString();
        postRequest=new StringRequest(Request.Method.POST,url,
                new Response.Listener<String>(){
            @Override
            public void onResponse(String response) {
                request_result.setText(response);
                try{
                    JSONObject ob=new JSONObject(response);
                    if(ob.getBoolean("state")==true)
                    writeFile(String.valueOf(ob.get("HASH")));
                }catch(JSONException e){
                    e.printStackTrace();
                }
            }
            },
                new Response.ErrorListener(){
            @Override
            public void onErrorResponse(VolleyError error) {
                request_result.setText("POST ERROR"+error.toString());
            }
        }
        ){
            @Override
            public String getBodyContentType(){
                return "application/json; charset=utf-16";
            }
            public byte[] getBody() throws AuthFailureError {
                try{
                    if (requestBody == null) return null;
                    return requestBody.getBytes("utf-16");
                }catch(UnsupportedEncodingException e){
                    VolleyLog.wtf("unsupported Encoding while trying to get the bytes of %s using %s",requestBody,"utf-16");
                    return null;
                }
            }

        };
        postRequest.setTag("postRequest");

        Log.d("json",requestBody);
        requestQueue.add(postRequest);
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
            FileOutputStream writer=new FileOutputStream(new File(path+"/out.txt"));
            writer.write(text.getBytes());
            Scanner sc=new Scanner(new File(path+"/out.txt"));
            String s="";
            while(sc.hasNextLine()){
                s=s+sc.nextLine();
            }
            sc.close();
            request_result.setText("registered successfully!");
        } catch (FileNotFoundException e) {
            request_result.setText("file not found");
            throw new RuntimeException(e);
        } catch (IOException e) {
            request_result.setText("ioexception");
            throw new RuntimeException(e);
        }
    }
    void cipher(String str,String key){
        return;
        /*
        int arr[]=new int[str.length()];
        int karr[]=new int[key.length()];
        for(int i=0;i<str.length();i++){
            arr[i]=(int)str.charAt(i);
        }
        for(int i=0;i<key.length();i++){
            karr[i]=(int)key.charAt(i);
        }
        for(int i=0;i<str.length();i++){
            Log.d("dep",arr[i]+":");
            arr[i]=arr[i]^karr[i%key.length()];
        }
        StringBuffer strb=new StringBuffer(str);
        for(int i=0;i<str.length();i++){
            strb.setCharAt(i, (char) arr[i]);
        }
        str=strb.toString();
        */
    }
    public boolean checkPermissions(String permission){
        return ContextCompat.checkSelfPermission(this,permission)==PackageManager.PERMISSION_GRANTED;
    }
}