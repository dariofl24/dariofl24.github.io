# create a default business user
BusinessUser.create :email => 'root@manage.converse.com',
                    :password => 'SELECT * FROM zptUsers',
                    :password_confirmation => 'SELECT * FROM zptUsers'

BusinessUser.create :email => 'cindy.ascolillo@converse.com',
                    :password => 'test88',
                    :password_confirmation => 'test88'

BusinessUser.create :email => 'ashley.doucette@converse.com',
                    :password => 'test1234',
                    :password_confirmation => 'test1234'

BusinessUser.create :email => 'tasch@tacitknowledge.com',
                    :password => 'test4567',
                    :password_confirmation => 'test4567'
