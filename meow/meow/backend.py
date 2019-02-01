from social_core.backends.slack import SlackOAuth2


class MeowAuth(SlackOAuth2):
    name = 'meow'

    def get_user_details(self, response):
        """Return user details from Slack account"""
        # Build the username with the team $username@$team_url
        # Necessary to get unique names for all of slack
        print("INSIDE USER DETAILS")
        print(response)
        user = response['user']
        team = response.get('team')
        name = user['name']
        email = user.get('email')
        username = email and email.split('@', 1)[0] or name
        fullname = user['real_name']
        full_name_list = fullname.split(' ', 1)
        first_name = full_name_list[0]
        last_name = full_name_list[1]
        print(first_name)
        print(last_name)

        if self.setting('USERNAME_WITH_TEAM', True) and team and \
           'name' in team:
            username = '{0}@{1}'.format(username, response['team']['name'])

        return {
            'username': username,
            'email': email,
            'fullname': fullname,
            'first_name': first_name,
            'last_name': last_name
        }

    def user_data(self, access_token, *args, **kwargs):
        """Loads user data from service"""
        temp_res = kwargs.get("response")
        user_id = temp_res['user_id']
        response = self.get_json('https://slack.com/api/users.info',
                                    params={'token': access_token, 'user': user_id})
        print("LOOK HERE")
        if not response.get('id', None):
            response['id'] = user_id
        return response
