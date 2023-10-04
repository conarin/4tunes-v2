## 内部用API

| Method                   | Endpoint                                             | Description                                                  |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------ |
| POST                     | /minecraft/players                                   | Minecraftアカウント                                          |
| GET, DELETE              | /minecraft/players/{player.uuid}                     | リンクしているユーザー                                       |
|                          |                                                      |                                                              |
| GET                      | /users/{user.id}/minecraft                           | リンクしているMinecraftアカウントのリスト                    |
| GET                      | /users/{user.id}/guilds                              | ユーザーのメンバーデータがあるギルドIDのリスト               |
|                          |                                                      |                                                              |
| POST                     | /guilds                                              | ギルドオプション                                             |
| GET, PATCH               | /guilds/{guild.id}/                                  | ギルドオプション(プレフィックスやレベルアップ通知チャンネルなど) |
| GET, POST                | /guilds/{guild.id}/members                           | メンバーデータ                                               |
| GET, PATCH               | /guilds/{guild.id}/members/{user.id}                 | メンバーデータ(発言数や経験値など)                           |
| GET, POST                | /guilds/{guild.id}/members/{user.id}/roles           | メンバーのロールリスト(ロールキーパー)                       |
| DELETE                   | /guilds/{guild.id}/members/{user.id}/roles/{role.id} | メンバーのロール                                             |
| GET, POST                | /guilds/{guild.id}/members/{user.id}/points          | メンバーのポイントトランザクション(いつ何ポイント増減したかなど) |
| GET, POST                | /guilds/{guild.id}/members/{user.id}/messages        | メンバーのメッセージトランザクション(いつどこで発言したか)   |
| GET, POST                | /guilds/{guild.id}/members/{user.id}/exp             | メンバーの経験値トランザクション(いつ何ポイント増えたかなど) |
|                          |                                                      |                                                              |
| GET                      | /guilds/{guild.id}/ranking/point                     | ギルドのポイントランキング                                   |
| GET                      | /guilds/{guild.id}/ranking/message                   | ギルドの発言数ランキング                                     |
| GET                      | /guilds/{guild.id}/ranking/exp                       | ギルドの経験値ランキング                                     |
|                          |                                                      |                                                              |
| GET, POST                | /guilds/{guild.id}/role-panels                       | ロールパネル一覧                                             |
| GET, POST, DELETE, PATCH | /guilds/{guild.id}/role-panels/{panel.id}            | ロールパネル詳細                                             |
| DELETE                   | /guilds/{guild.id}/role-panels/{panel.id}/{role.id}  | ロールパネルから除去                                         |

### Minecraft

#### ユーザーにリンクするMinecraftアカウントを追加

`POST /minecraft/players`

##### JSONパラメータ

| 名前    | 型     | 説明                                                  |
| ------- | ------ | ----------------------------------------------------- |
| uuid    | string | MinecraftアカウントのUUID。ハイフンの有無は問わない。 |
| user_id | string | リンクさせるユーザーのID。                            |

成功すると201の空レスポンスが返る。すでにリンクされているUUIDの場合409の空レスポンスが返る。

#### リンクしているユーザーを取得

`GET /minecraft/players/{player.uuid}`

成功すると以下のようなレスポンスが返る。存在しない場合は404が返る。

##### レスポンス

```json
{
    "uuid": "4328d5fb-e4ed-461f-8349-d7df34910547",
    "user_id": "478580770978660352",
    "created_at": "2022-08-14T09:09:13.000Z"
}
```

#### リンクしているアカウントを削除

`DELETE /minecraft/players/{player.uuid}`

成功すると204の空レスポンスが返る。存在しない場合や削除済みは404が返る。

#### ユーザーがリンクしているアカウントを取得

`GET /users/{user.id}/minecraft`

成功すると以下のようなレスポンスが返る。データが無い場合は200で空の配列が返る。ユーザーが存在しない場合は404が返る。

```json
[
    {
        "uuid": "4328d5fb-e4ed-461f-8349-d7df34910547",
        "user_id": "478580770978660352",
        "created_at":"2022-08-14T09:09:13.000Z"
    },
    {
        "uuid": "d19012e3-b6d4-4678-b339-be10a5f3e831",
        "user_id": "478580770978660352",
        "created_at": "2022-08-14T15:44:11.000Z"
    }
]
```

### Discord

#### ユーザーのメンバーデータがあるギルドIDのリスト

`GET /users/{user.id}/guilds`

成功すると以下のようなレスポンスが返る。データが無い場合は200で空の配列が返る。ユーザーが存在しない場合は404が返る。

```json
[
    "699957943377854485"
]
```

#### ギルドデータを作成

`POST /guilds`

##### JSONパラメータ

| 名前     | 型     | 説明                         |
| -------- | ------ | ---------------------------- |
| guild_id | string | データを作成するギルドのID。 |

成功すると201の空レスポンスが返る。すでに作成されているギルドの場合409の空レスポンスが返る。

#### ギルドデータを取得

`GET /guilds/{guild.id}`

成功すると以下のようなレスポンスが返る。存在しない場合は404が返る。

```json
{
    "guild_id": "603434131879100416",
    "log_channel_id": "600693058916581376",
    "level_up_notice_channel_id": null,
    "should_keep_roles": 1,
    "created_at": "2022-08-14T19:18:20.000Z",
    "updated_at": "2022-08-15T16:57:52.000Z"
}
```

#### ギルドデータを更新

`PATCH /guilds/{guild.id}`

##### JSONパラメータ

| 名前                       | 型                 | 説明                                                         |
| -------------------------- | ------------------ | ------------------------------------------------------------ |
| log_channel_id             | string または null | メッセージログのチャンネルID。記録しない場合はnull。         |
| level_up_notice_channel_id | string または null | レベルアップ通知のチャンネルID。通知しない場合はnull。発言したチャンネルの場合1。 |
| should_keep_roles          | boolean            | ロールキーパーのフラグ。                                     |

成功すると204の空レスポンスが返る。

#### メンバーデータの配列を取得

`GET /guilds/{guild.id}/members`

成功すると以下のようなレスポンスが返る。存在しない場合は404が返る。

```json
[
    {
        "user_id": "478580770978660352",
        "guild_id": "681136028610068481",
        "is_notify": 1,
        "chain_login": 0,
        "point_balance": 0,
        "exp": 0,
        "message_count": 0,
        "created_at": "2022-08-15T07:35:00.000Z",
        "updated_at": "2022-09-11T13:40:36.000Z"
	}
]
```

#### メンバーデータを作成

`POST /guilds/{guild.id}/members`

##### JSONパラメータ

| 名前    | 型     | 説明                           |
| ------- | ------ | ------------------------------ |
| user_id | string | データを作成するユーザーのID。 |

成功すると201の空レスポンスが返る。すでに作成されている場合409の空レスポンスが返る。

#### メンバーデータを取得

`GET /guilds/{guild.id}/members/{user.id}`

成功すると以下のようなレスポンスが返る。存在しない場合は404が返る。

```json
{
    "user_id": "478580770978660352",
    "guild_id": "681136028610068481",
    "is_notify": 1,
    "chain_login": 0,
    "point_balance": 0,
    "exp": 0,
    "message_count": 0,
    "created_at": "2022-08-15T07:35:00.000Z",
    "updated_at": "2022-09-11T13:40:36.000Z"
}
```

#### メンバーデータを更新

`PATCH /guilds/{guild.id}/members/{user.id}`

##### JSONパラメータ

| 名前        | 型      | 説明                             |
| ----------- | ------- | -------------------------------- |
| is_notify   | boolean | レベルアップ通知を表示させるか。 |
| chain_login | number  | 連続ログインボーナス受取り日数。 |

成功すると204の空レスポンスが返る。

#### メンバーのロール一覧を取得

`GET /guilds/{guild.id}/members/{user.id}/roles`

成功すると以下のようなレスポンスが返る。データが無い場合は200で空の配列が返る。メンバーデータが存在しない場合は404が返る。

```json
[
  {
    "role_id": "636070103296770048",
    "created_at": "2022-09-11T15:54:29.000Z"
  }
]
```

#### メンバーのロールを追加

`POST /guilds/{guild.id}/members/{user.id}/roles`

##### JSONパラメータ

| 名前    | 型     | 説明                 |
| ------- | ------ | -------------------- |
| role_id | string | 追加するロールのID。 |

成功すると201の空レスポンスが返る。すでに追加されている場合409の空レスポンスが返る。

#### メンバーのロールを削除

`DELETE /guilds/{guild.id}/members/{user.id}/roles/{role.id}`

成功すると204の空レスポンスが返る。存在しない場合や削除済みは404が返る。

#### メンバーのポイント履歴を取得

`GET /guilds/{guild.id}/members/{user.id}/points`

成功すると以下のような`created_at`の降順でソートされたレスポンスが返る。データが無い場合は200で空の配列が返る。メンバーデータが存在しない場合は404が返る。

```json
[
    {
        "channel_id": null,
        "message_id": null,
        "amount": 10,
        "reason": null,
        "created_at": "2022-08-17T04:23:38.000Z"
    }
]
```

#### メンバーのポイント履歴を追加

`POST /guilds/{guild.id}/members/{user.id}/points`

##### JSONパラメータ

| 名前        | 型     | 説明         |
| ----------- | ------ | ------------ |
| channel_id? | string | チャンネルID |
| message_id? | string | メッセージID |
| amount      | number | ポイント量   |
| reason?     | string | 理由         |

成功すると201の空レスポンスが返る。

#### メンバーのメッセージ一覧を取得

`GET /guilds/{guild.id}/members/{user.id}/messages`

成功すると以下のような`created_at`の降順でソートされたレスポンスが返る。データが無い場合は200で空の配列が返る。メンバーデータが存在しない場合は404が返る。

```json
[
    {
        "channel_id": "840604162848849920",
        "message_id": "840604246083633212",
        "created_at": "2022-08-17T07:23:04.000Z"
    }
]
```

#### メンバーのメッセージを追加

`POST /guilds/{guild.id}/members/{user.id}/messages`

##### JSONパラメータ

| 名前       | 型     | 説明                     |
| ---------- | ------ | ------------------------ |
| channel_id | string | チャンネルID。           |
| message_id | string | 追加するメッセージのID。 |

成功すると201の空レスポンスが返る。すでに追加されている場合409の空レスポンスが返る。

#### メンバーの経験値履歴を取得

`GET /guilds/{guild.id}/members/{user.id}/exp`

成功すると以下のような`created_at`の降順でソートされたレスポンスが返る。データが無い場合は200で空の配列が返る。メンバーデータが存在しない場合は404が返る。

```json
[
    {
        "channel_id": null,
        "message_id": null,
        "amount": 1,
        "reason": null,
        "created_at": "2022-08-17T04:23:38.000Z"
    }
]
```

#### メンバーの経験値履歴を追加

`POST /guilds/{guild.id}/members/{user.id}/exp`

##### JSONパラメータ

| 名前        | 型     | 説明         |
| ----------- | ------ | ------------ |
| channel_id? | string | チャンネルID |
| message_id? | string | メッセージID |
| amount      | number | 経験値量     |
| reason?     | string | 理由         |

成功すると201の空レスポンスが返る。

#### ギルドのポイントランキングを取得

`GET /guilds/{guild.id}/ranking/point`

成功すると以下のような`point_balance`の降順でソートされたレスポンスが返る。メンバーデータが存在しない場合は404が返る。

```json
[
    {
        "user_id": "478580770978660352",
        "point_balance": 716,
        "rank": 1
    }
]
```

#### ギルドの発言数ランキングを取得

`GET /guilds/{guild.id}/ranking/message`

成功すると以下のような`message_count`の降順でソートされたレスポンスが返る。メンバーデータが存在しない場合は404が返る。

```json
[
    {
        "user_id": "478580770978660352",
        "message_count": 50,
        "rank": 1
    }
]
```

#### ギルドの経験値ランキングを取得

`GET /guilds/{guild.id}/ranking/exp`

成功すると以下のような`exp`の降順でソートされたレスポンスが返る。メンバーデータが存在しない場合は404が返る。

```json
[
    {
        "user_id": "478580770978660352",
        "exp": 65,
        "rank": 1
    }
]
```

#### ギルドのロールパネルを追加

`POST /guilds/{guild.id}/role-panels`

##### JSONパラメータ

| 名前       | 型     | 説明                    |
| ---------- | ------ | ----------------------- |
| channel_id | string | チャンネルID            |
| message_id | string | メッセージID            |
| title?     | string | 埋め込みタイトル        |
| color?     | string | 埋め込みhexカラーコード |

成功すると201の空レスポンスが返る。すでに追加されている場合409の空レスポンスが返る。

#### ギルドのロールパネル一覧を取得

`GET /guilds/{guild.id}/role-panels`

成功すると以下のようなレスポンスが返る。データが無い場合は200で空の配列が返る。

```json
[
    {
        "id": 1,
      	"guild_id": "603434131879100416",
        "channel_id": "840604162848849920",
        "message_id": "840604246083633212",
        "title": "Role Panel",
        "color": "000000",
        "created_at": "2022-08-17T07:23:04.000Z"
    }
]
```

#### ギルドのロールパネルのロールを追加

`POST /guilds/{guild.id}/role-panels/{panel.id}`

成功すると201の空レスポンスが返る。すでに追加されている場合409の空レスポンスが返る。

##### JSONパラメータ

| 名前    | 型     | 説明     |
| ------- | ------ | -------- |
| role_id | string | ロールID |

#### ギルドのロールパネルを取得

`GET /guilds/{guild.id}/role-panels/{panel.id}`

成功すると以下のようなレスポンスが返る。データが無い場合は404が返る。

```json
{
    "id": 1,
    "guild_id": "603434131879100416",
    "channel_id": "840604162848849920",
    "message_id": "840604246083633212",
    "created_at": "2022-08-17T07:23:04.000Z"
}
```

#### ギルドのロールパネルを削除

`DELETE /guilds/{guild.id}/role-panels/{panel.id}`

成功すると204の空レスポンスが返る。データが無い場合は404が返る。

#### ギルドのロールパネルのロールを削除

`DELETE /guilds/{guild.id}/role-panels/{panel.id}/{role.id}`

成功すると204の空レスポンスが返る。データが無い場合は404が返る。
