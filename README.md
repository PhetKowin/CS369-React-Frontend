# CS369-React-Frontend
รายชื่อสมาชิก
1.กัลปพฤกษ์ โควินทเศรษฐ 6309610191
2.นภัสวรรณ มีผล 6309681390
3.ญารินดา ไปปอ 6309681515

#Script
sudo su –
sudo yum update -y
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
node -v
wget https://github.com/PhetKowin/CS369-React-Frontend/archive/refs/heads/main.zip
unzip main.zip
cd CS369-React-Frontend-main
npm install
npm run build
sudo npm install -g serve
serve -s build
