class TeamReady extends BaseScene implements eui.UIComponent {

	private joinTeamView;
	private teamHomeView;
	private inputTeamIDNoneFocus;
	private inputTeamIDFocus;
	private edtextTeamID: eui.EditableText;
	private btnJoinTeam: eui.Button;
	private teamInexistenceTip: eui.Image;
	public static TEAM_MATCH_STATE = { "AreMatching": 424, "RoomIsNull": 419, "succeed": 200, "dead": 2 };

	public constructor() {
		super();
	}



	protected onShow(par) {
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_TEAM_USER_INFO_NOTIFY, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_TEAM_NETWORKSTATE, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_ERROR, this.onEvent, this);
		console.log("[TeamReady] onShow:" + par);
	}


	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
		switch (partName) {
			case "croup_join_team":
				this.joinTeamView = instance;
				break;
			case "team_home":
				this.teamHomeView = instance;
				break;
			case "none_focus":
				this.inputTeamIDNoneFocus = instance;
				break;
			case "focus":
				this.inputTeamIDFocus = instance;
				break;
			case "edtext_team_id":
				this.edtextTeamID = instance;
				break;
			case "btn_join_team":
				this.btnJoinTeam = instance;
				break;
			case "team_inexistence":
				this.teamInexistenceTip = instance;
				break;
		}
	}


	protected onCreated(): void {
		console.log("[TeamReady] [onCreated] " + this.name);
		this.btnJoinTeam.enabled = false;
		this.edtextTeamID.addEventListener(egret.FocusEvent.FOCUS_OUT, function (e: egret.TouchEvent) {
			if (this.edtextTeamID.text === "") {
				this.isinputTeamIDFocus(false);
			}
		}, this);
	}

	public onClick(name: string, v: egret.DisplayObject) {
		switch (name) {
			case "back":
				if (this.joinTeamView.visible) {
					this.teamHomeView.visible = true;
					this.joinTeamView.visible = false;
				} else {
					SceneManager.back();
				}
				break;
			case "create_team":
				const teamInfo = new MVS.MsCreateTeamInfo();
				teamInfo.capacity = GameData.TeamMaxPlayer;
				teamInfo.mode = 0;
				teamInfo.password = "1";
				teamInfo.visibility = 0;
				teamInfo.userProfile = GameData.avatar;
				RombBoyMatchvsEngine.getInstance.creatTeam(teamInfo);
				break;
			case "join_team":
				this.joinTeamView.visible = true;
				this.teamHomeView.visible = false;
				break;
			case "none_focus":
				this.isinputTeamIDFocus(true);
				break;
			case "btn_join_team":
				var joinTeamInfo = { teamID: this.edtextTeamID.text, password: "1", userProfile: GameData.avatar };
				RombBoyMatchvsEngine.getInstance.joinTeam(joinTeamInfo);
				break;
		}
	}

	public onEvent(e: egret.Event): void {
		var data = e.data;
		switch (e.type) {
			case MatchvsMessage.MATCHVS_TEAM_USER_INFO_NOTIFY:
				console.log("MATCHVS_TEAM_USER_INFO_NOTIFY:"+data);
				switch (data.status) {
					case TeamReady.TEAM_MATCH_STATE.succeed:
						if (data.action === "joinTeam" || data.action === "createTeam") {
							SceneManager.showScene(TeamHome, data);
						}
						break;
					case TeamReady.TEAM_MATCH_STATE.RoomIsNull:
						this.teamInexistenceTip.visible = true;
						break;
					case TeamReady.TEAM_MATCH_STATE.AreMatching:
						Toast.show("您加入的队伍正在匹配");
						break;
				}
				break;
			default:
				break;
		}
	}

	/**
	 * 是否显示teamID输入框
	 */
	public isinputTeamIDFocus(isFocus: boolean) {
		this.inputTeamIDNoneFocus.visible = !isFocus;
		this.inputTeamIDFocus.visible = isFocus;
		this.btnJoinTeam.enabled = isFocus;
		if (isFocus) {
			this.edtextTeamID.setFocus();
		}
	}


    /**
     * 移除监听
     */
	public removeEvent() {
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_TEAM_USER_INFO_NOTIFY, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_TEAM_NETWORKSTATE, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_ERROR, this.onEvent, this);
	}


	protected onHide(): void {
		this.removeEvent();
	}



}