import requests

url = 'http://localhost:3000/api/register'

for i in range(1, 101):
    usn = f"user{i}wbd"
    em = f"{usn}@mail.com"
    passwd = f"Password{i}_"
    myobj = {
        'username': usn,
        'email': em,
        'name': usn,
        'password': passwd,
        'confirmPassword': passwd
    }
    try:
        x = requests.post(url, json=myobj)
        print(f"Response for user {usn}: {x.text}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
