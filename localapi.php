<?php

//----------------------------------------------------------------------------//
//Options:                                                                    //
//  Action:                                                                   //
//    - list: put a objetive                                                  //
//        - showall: show all objetives, it dont send packages                //
//    - scan: do scan                                                         //
//        - maclist: show MAC address from the IP given.                      //
//        - oslist: show information about own operative system if possible.  //
//        - portlist: show a list of all available ports.                     //
//        - fullscan: perform a complete scan.                                //
//    - myip: show the ip user                                                //
//                                                                            //
//  **If you want another options, only need change parameters                //                                                //
//----------------------------------------------------------------------------//

$_GET = [
  'action' => 'scan',
   'type' => 'maclist',
   //'ipfilter' => '192.168.10.40'
];

//--
$ifconfig = shell_exec('ifconfig');
$pattern = "/inet addr:(.*)\s*Bcast:(.*)\s*Mask:(.*)/m";


if(!preg_match_all($pattern, $ifconfig, $matches)){
  $output = [
    'status' => 'error',
  ];
  echo json_encode($output);
  exit();
}

$ips = $matches[1];
$output = [
  'scans' => [],
  'status' => 'error',
];

foreach($ips as $ip){
  if(isset($_GET['action']) && $_GET['action'] == "myip"){
    $output['scans'][$ip] = $ip;
  }

  elseif (isset($_GET['action']) && $_GET['action'] == "list"){
    if(isset($_GET['type']) == "showall"){
      $ipP = explode('.', $ip);
      $masc = $ipP[0].'.'.$ipP[1].'.'.$ipP[2].'.1-255';
      $salida = shell_exec('nmap -sL'.' '.$masc);
      $output['scans'][$ip] = $salida;
    }
  }

  elseif (isset($_GET['action']) && $_GET['action'] == "scan"){
    if(isset($_GET['type']) && $_GET['type'] == "maclist"){
      if(isset($_GET['ipfilter']) && $_GET['ipfilter'] == $ip){
        $salida = shell_exec('nmap -sP '.$ip);
        $output['scans'][$ip] = $salida;
      }
      else{
        $ipP = explode('.', $ip);
        $masc = $ipP[0].'.'.$ipP[1].'.'.$ipP[2].'.1-255';
        $salida = shell_exec('nmap -sP'.' '.$masc);
        $output['scans'][$ip] = $salida;
      }
    }
    elseif(isset($_GET['type']) && $_GET['type'] == "oslist"){
      if(isset($_GET['ipfilter'])){
        if ( $_GET['ipfilter'] == $ip ){
          $salida = shell_exec('nmap -O '.$ip);
          $output['scans'][$ip] = $salida;
        }
      }
      else{
        $ipP = explode('.', $ip);
        $masc = $ipP[0].'.'.$ipP[1].'.'.$ipP[2].'.1-255';
        $salida = shell_exec('nmap -O'.' '.$masc);
        $output['scans'][$ip] = $salida;
      }
    }
    elseif(isset($_GET['type']) == "portlist"){
      if(isset($_GET['ipfilter']) && $_GET['ipfilter'] == $ip){
          $salida = shell_exec('nmap '.$ip);
          $output['scans'][$ip] = $salida;
      }
      else{
        $ipP = explode('.', $ip);
        $masc = $ipP[0].'.'.$ipP[1].'.'.$ipP[2].'.1-255';
        $salida = shell_exec('nmap'.' '.$masc);
        $output['scans'][$ip] = $salida;
      }
    }
    elseif(isset($_GET['type']) == "fullscan"){
      if(isset($_GET['ipfilter']) && $_GET['ipfilter'] == $ip){
        $salida = shell_exec('nmap -sV '.$ip);
        $output['scans'][$ip] = $salida;
      }
      else{
        $ipP = explode('.', $ip);
        $masc = $ipP[0].'.'.$ipP[1].'.'.$ipP[2].'.1-255';
        $salida = shell_exec('nmap -sV'.' '.$masc);
        $output['scans'][$ip] = $salida;
      }
    }
  }
}
$output['status'] = 'ok';
print_r($output);
//echo json_encode($output);
echo "\n";
