<template>
  <div id="gantt-container">
    <button
      @click="saveGanttOnServer"
      class="button first big requireWrite"
      title="Save"
    >
      Lưu chỉnh sửa task
    </button>
    <!-- Div chính sẽ chứa Gantt -->
    <div
      id="workSpace"
      style="
        padding: 0px;
        overflow-y: auto;
        overflow-x: hidden;
        border: 1px solid #e5e5e5;
        position: relative;
        margin: 0 5px;
      "
    ></div>
  </div>
  <div id="gantEditorTemplates" style="display: none">
    <div class="__template__" type="GANTBUTTONS">
      <div class="ganttButtonBar noprint">
        <div class="buttons">

          <button
            onclick="$('#workSpace').trigger('undo.gantt');return false;"
            class="button textual icon requireCanWrite"
            title="undo"
          >
            <span class="teamworkIcon">&#39;</span>
          </button>
          <button
            onclick="$('#workSpace').trigger('redo.gantt');return false;"
            class="button textual icon requireCanWrite"
            title="redo"
          >
            <span class="teamworkIcon">&middot;</span>
          </button>
          <span
            class="ganttButtonSeparator requireCanWrite requireCanAdd"
          ></span>
          <button
            onclick="$('#workSpace').trigger('addAboveCurrentTask.gantt');return false;"
            class="button textual icon requireCanWrite requireCanAdd"
            title="insert above"
          >
            <span class="teamworkIcon">l</span>
          </button>
          <button
            onclick="$('#workSpace').trigger('addBelowCurrentTask.gantt');return false;"
            class="button textual icon requireCanWrite requireCanAdd"
            title="insert below"
          >
            <span class="teamworkIcon">X</span>
          </button>
          <span
            class="ganttButtonSeparator requireCanWrite requireCanInOutdent"
          ></span>
          <button
            onclick="$('#workSpace').trigger('outdentCurrentTask.gantt');return false;"
            class="button textual icon requireCanWrite requireCanInOutdent"
            title="un-indent task"
          >
            <span class="teamworkIcon">.</span>
          </button>
          <button
            onclick="$('#workSpace').trigger('indentCurrentTask.gantt');return false;"
            class="button textual icon requireCanWrite requireCanInOutdent"
            title="indent task"
          >
            <span class="teamworkIcon">:</span>
          </button>
          <span
            class="ganttButtonSeparator requireCanWrite requireCanMoveUpDown"
          ></span>
          <button
            onclick="$('#workSpace').trigger('moveUpCurrentTask.gantt');return false;"
            class="button textual icon requireCanWrite requireCanMoveUpDown"
            title="move up"
          >
            <span class="teamworkIcon">k</span>
          </button>
          <button
            onclick="$('#workSpace').trigger('moveDownCurrentTask.gantt');return false;"
            class="button textual icon requireCanWrite requireCanMoveUpDown"
            title="move down"
          >
            <span class="teamworkIcon">j</span>
          </button>
          <span
            class="ganttButtonSeparator requireCanWrite requireCanDelete"
          ></span>
          <button
            onclick="$('#workSpace').trigger('deleteFocused.gantt');return false;"
            class="button textual icon delete requireCanWrite"
            title="Elimina"
          >
            <span class="teamworkIcon">&cent;</span>
          </button>
          <span class="ganttButtonSeparator"></span>
          <button
            onclick="$('#workSpace').trigger('expandAll.gantt');return false;"
            class="button textual icon"
            title="EXPAND_ALL"
          >
            <span class="teamworkIcon">6</span>
          </button>
          <button
            onclick="$('#workSpace').trigger('collapseAll.gantt'); return false;"
            class="button textual icon"
            title="COLLAPSE_ALL"
          >
            <span class="teamworkIcon">5</span>
          </button>

          <span class="ganttButtonSeparator"></span>
          <button
            onclick="$('#workSpace').trigger('zoomMinus.gantt'); return false;"
            class="button textual icon"
            title="zoom out"
          >
            <span class="teamworkIcon">)</span>
          </button>
          <button
            onclick="$('#workSpace').trigger('zoomPlus.gantt');return false;"
            class="button textual icon"
            title="zoom in"
          >
            <span class="teamworkIcon">(</span>
          </button>
          <span class="ganttButtonSeparator"></span>
          <button
            onclick="$('#workSpace').trigger('print.gantt');return false;"
            class="button textual icon"
            title="Print"
          >
            <span class="teamworkIcon">p</span>
          </button>
          <span class="ganttButtonSeparator"></span>
          <button
            onclick="ge.gantt.showCriticalPath=!ge.gantt.showCriticalPath; ge.redraw();return false;"
            class="button textual icon requireCanSeeCriticalPath"
            title="CRITICAL_PATH"
          >
            <span class="teamworkIcon">&pound;</span>
          </button>
          <span class="ganttButtonSeparator requireCanSeeCriticalPath"></span>
          <button
            onclick="ge.splitter.resize(.1);return false;"
            class="button textual icon"
          >
            <span class="teamworkIcon">F</span>
          </button>
          <button
            onclick="ge.splitter.resize(50);return false;"
            class="button textual icon"
          >
            <span class="teamworkIcon">O</span>
          </button>
          <button
            onclick="ge.splitter.resize(100);return false;"
            class="button textual icon"
          >
            <span class="teamworkIcon">R</span>
          </button>
          <span class="ganttButtonSeparator"></span>
          <button
            onclick="$('#workSpace').trigger('fullScreen.gantt');return false;"
            class="button textual icon"
            title="FULLSCREEN"
            id="fullscrbtn"
          >
            <span class="teamworkIcon">@</span>
          </button>
          <button
            onclick="ge.element.toggleClass('colorByStatus' );return false;"
            class="button textual icon"
          >
            <span class="teamworkIcon">&sect;</span>
          </button>

          <button
            onclick="editResources();"
            class="button textual requireWrite"
            title="edit resources"
          >
            <span class="teamworkIcon">M</span>
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp;
        </div>

        <div>
          <input type="file" name="load-file" id="load-file" />
          <label for="load-file">Load</label>
          <button
            onclick="newProject();"
            class="button requireWrite newproject"
          >
            <em>clear project</em>
          </button>
          <button
            class="button login"
            title="login/enroll"
            onclick="loginEnroll($(this));"
            style="display: none"
          >
            login/enroll
          </button>
          <button
            class="button opt collab"
            title="Start with Twproject"
            onclick="collaborate($(this));"
            style="display: none"
          >
            <em>collaborate</em>
          </button>
        </div>
      </div>
    </div>
    <div class="__template__" type="TASKSEDITHEAD">
      <!--
  <table class="gdfTable" cellspacing="0" cellpadding="0">
    <thead>
    <tr style="height:40px">
      <th class="gdfColHeader" style="width:35px; border-right: none"></th>
      <th class="gdfColHeader" style="width:25px;"></th>
      <th class="gdfColHeader gdfResizable" style="width:100px;">code/short name</th>
      <th class="gdfColHeader gdfResizable" style="width:300px;">name</th>
      <th class="gdfColHeader"  align="center" style="width:17px;" title="Start date is a milestone."><span class="teamworkIcon" style="font-size: 8px;">^</span></th>
      <th class="gdfColHeader gdfResizable" style="width:80px;">start</th>
      <th class="gdfColHeader"  align="center" style="width:17px;" title="End date is a milestone."><span class="teamworkIcon" style="font-size: 8px;">^</span></th>
      <th class="gdfColHeader gdfResizable" style="width:80px;">End</th>
      <th class="gdfColHeader gdfResizable" style="width:50px;">dur.</th>
      <th class="gdfColHeader gdfResizable" style="width:20px;">%</th>
      <th class="gdfColHeader gdfResizable requireCanSeeDep" style="width:50px;">depe.</th>
      <th class="gdfColHeader gdfResizable" style="width:1000px; text-align: left; padding-left: 10px;">assignees</th>
    </tr>
    </thead>
  </table>
  -->
    </div>

    <div class="__template__" type="TASKROW">
      <!--
  <tr id="tid_(#=obj.id#)" taskId="(#=obj.id#)" class="taskEditRow (#=obj.isParent()?'isParent':''#) (#=obj.collapsed?'collapsed':''#)" level="(#=level#)">
    <th class="gdfCell edit" align="right" style="cursor:pointer;"><span class="taskRowIndex">(#=obj.getRow()+1#)</span> <span class="teamworkIcon" style="font-size:12px;" >e</span></th>
    <td class="gdfCell noClip" align="center"><div class="taskStatus cvcColorSquare" status="(#=obj.status#)"></div></td>
    <td class="gdfCell"><input type="text" name="code" value="(#=obj.code?obj.code:''#)" placeholder="code/short name"></td>
    <td class="gdfCell indentCell cell-name" style="padding-left:(#=obj.level*10+18#)px;">
      <div class="exp-controller" align="center"></div>
      <input type="text" name="name" value="(#=obj.name#)" placeholder="name">
      <i class="fa-solid fa-circle-plus add-subtasks" title="Thêm task con" @click="addSubtask((#=obj.id#))"></i>
    </td>
    <td class="gdfCell" align="center"><input type="checkbox" name="startIsMilestone"></td>
    <td class="gdfCell"><input type="text" name="start"  value="" class="date"></td>
    <td class="gdfCell" align="center"><input type="checkbox" name="endIsMilestone"></td>
    <td class="gdfCell"><input type="text" name="end" value="" class="date"></td>
    <td class="gdfCell"><input type="text" name="duration" autocomplete="off" value="(#=obj.duration#)"></td>
    <td class="gdfCell"><input type="text" name="progress" class="validated" entrytype="PERCENTILE" autocomplete="off" value="(#=obj.progress?obj.progress:''#)" (#=obj.progressByWorklog?"readOnly":""#)></td>
    <td class="gdfCell requireCanSeeDep"><input type="text" name="depends" autocomplete="off" value="(#=obj.depends#)" (#=obj.hasExternalDep?"readonly":""#)></td>
    <td class="gdfCell taskAssigs">(#=obj.getAssigsString()#)</td>
  </tr>
  -->
    </div>

    <div class="__template__" type="TASKEMPTYROW">
      <!--
  <tr class="taskEditRow emptyRow" >
    <th class="gdfCell" align="right"></th>
    <td class="gdfCell noClip" align="center"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell"></td>
    <td class="gdfCell requireCanSeeDep"></td>
    <td class="gdfCell"></td>
  </tr>
  -->
    </div>

    <div class="__template__" type="TASKBAR">
      <!--
  <div class="taskBox taskBoxDiv" taskId="(#=obj.id#)" >
    <div class="layout (#=obj.hasExternalDep?'extDep':''#)">
      <div class="taskStatus" status="(#=obj.status#)"></div>
      <div class="taskProgress" style="width:(#=obj.progress>100?100:obj.progress#)%; background-color:(#=obj.progress>100?'red':'rgb(153,255,51);'#);"></div>
      <div class="milestone (#=obj.startIsMilestone?'active':''#)" ></div>

      <div class="taskLabel"></div>
      <div class="milestone end (#=obj.endIsMilestone?'active':''#)" ></div>
    </div>
  </div>
  -->
    </div>
    <div class="__template__" type="CHANGE_STATUS">
      <!--
    <div class="taskStatusBox">
    <div class="taskStatus cvcColorSquare" status="STATUS_ACTIVE" title="Active"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_DONE" title="Completed"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_FAILED" title="Failed"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_SUSPENDED" title="Suspended"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_WAITING" title="Waiting" style="display: none;"></div>
    <div class="taskStatus cvcColorSquare" status="STATUS_UNDEFINED" title="Undefined"></div>
    </div>
  -->
    </div>
    <div class="__template__" type="TASK_EDITOR">
      <!--
  <div class="ganttTaskEditor">
    <h2 class="taskData">Task editor</h2>
    <table  cellspacing="1" cellpadding="5" width="100%" class="taskData table" border="0">
          <tr>
        <td width="200" style="height: 80px"  valign="top">
          <label for="code">code/short name</label><br>
          <input type="text" name="code" id="code" value="" size=15 class="formElements" autocomplete='off' maxlength=255 style='width:100%' oldvalue="1">
        </td>
        <td colspan="3" valign="top"><label for="name" class="required">name</label><br><input type="text" name="name" id="name"class="formElements" autocomplete='off' maxlength=255 style='width:100%' value="" required="true" oldvalue="1"></td>
          </tr>


      <tr class="dateRow">
        <td nowrap="">
          <div style="position:relative">
            <label for="start">start</label>&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="checkbox" id="startIsMilestone" name="startIsMilestone" value="yes"> &nbsp;<label for="startIsMilestone">is milestone</label>&nbsp;
            <br><input type="text" name="start" id="start" size="8" class="formElements dateField validated date" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DATE">
            <span title="calendar" id="starts_inputDate" class="teamworkIcon openCalendar" onclick="$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});">m</span>          </div>
        </td>
        <td nowrap="">
          <label for="end">End</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <input type="checkbox" id="endIsMilestone" name="endIsMilestone" value="yes"> &nbsp;<label for="endIsMilestone">is milestone</label>&nbsp;
          <br><input type="text" name="end" id="end" size="8" class="formElements dateField validated date" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DATE">
          <span title="calendar" id="ends_inputDate" class="teamworkIcon openCalendar" onclick="$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});">m</span>
        </td>
        <td nowrap="" >
          <label for="duration" class=" ">Days</label><br>
          <input type="text" name="duration" id="duration" size="4" class="formElements validated durationdays" title="Duration is in working days." autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DURATIONDAYS">&nbsp;
        </td>
      </tr>

      <tr>
        <td  colspan="2">
          <label for="status" class=" ">status</label><br>
          <select id="status" name="status" class="taskStatus" status="(#=obj.status#)"  onchange="$(this).attr('STATUS',$(this).val());">
            <option value="STATUS_ACTIVE" class="taskStatus" status="STATUS_ACTIVE" >active</option>
            <option value="STATUS_WAITING" class="taskStatus" status="STATUS_WAITING" >suspended</option>
            <option value="STATUS_SUSPENDED" class="taskStatus" status="STATUS_SUSPENDED" >suspended</option>
            <option value="STATUS_DONE" class="taskStatus" status="STATUS_DONE" >completed</option>
            <option value="STATUS_FAILED" class="taskStatus" status="STATUS_FAILED" >failed</option>
            <option value="STATUS_UNDEFINED" class="taskStatus" status="STATUS_UNDEFINED" >undefined</option>
          </select>
        </td>

        <td valign="top" nowrap>
          <label>progress</label><br>
          <input type="text" name="progress" id="progress" size="7" class="formElements validated percentile" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="PERCENTILE">
        </td>
      </tr>

          </tr>
          <tr>
            <td colspan="4">
              <label for="description">Description</label><br>
              <textarea rows="3" cols="30" id="description" name="description" class="formElements" style="width:100%"></textarea>
            </td>
          </tr>
        </table>

    <h2>Assignments</h2>
  <table  cellspacing="1" cellpadding="0" width="100%" id="assigsTable">
    <tr>
      <th style="width:100px;">name</th>
      <th style="width:70px;">Role</th>
      <th style="width:30px;">est.wklg.</th>
      <th style="width:30px;" id="addAssig"><span class="teamworkIcon" style="cursor: pointer">+</span></th>
    </tr>
  </table>

  <div style="text-align: right; padding-top: 20px">
    <span id="saveButton" class="button first" onClick="$(this).trigger('saveFullEditor.gantt');">Save</span>
  </div>

  </div>
  -->
    </div>
    <div class="__template__" type="ASSIGNMENT_ROW">
      <!--
  <tr taskId="(#=obj.task.id#)" assId="(#=obj.assig.id#)" class="assigEditRow" >
    <td ><select name="resourceId"  class="formElements" (#=obj.assig.id.indexOf("tmp_")==0?"":"disabled"#) ></select></td>
    <td ><select type="select" name="roleId"  class="formElements"></select></td>
    <td ><input type="text" name="effort" value="(#=getMillisInHoursMinutes(obj.assig.effort)#)" size="5" class="formElements"></td>
    <td align="center"><span class="teamworkIcon delAssig del" style="cursor: pointer">d</span></td>
  </tr>
  -->
    </div>
    <div class="__template__" type="RESOURCE_EDITOR">
      <!--
  <div class="resourceEditor" style="padding: 5px;">

    <h2>Project team</h2>
    <table  cellspacing="1" cellpadding="0" width="100%" id="resourcesTable">
      <tr>
        <th style="width:100px;">name</th>
        <th style="width:30px;" id="addResource"><span class="teamworkIcon" style="cursor: pointer">+</span></th>
      </tr>
    </table>

    <div style="text-align: right; padding-top: 20px"><button id="resSaveButton" class="button big">Save</button></div>
  </div>
  -->
    </div>
    <div class="__template__" type="RESOURCE_ROW">
      <!--
  <tr resId="(#=obj.id#)" class="resRow" >
    <td ><input type="text" name="name" value="(#=obj.name#)" style="width:100%;" class="formElements"></td>
    <td align="center"><span class="teamworkIcon delRes del" style="cursor: pointer">d</span></td>
  </tr>
  -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { loadScript, unloadScript } from 'vue-plugin-load-script'
import { useMenu } from '../stores/use-menu.js'

import useAxiosStore from '../stores/use-axios'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default {
  name: 'JQueryGantt',
  setup() {
      const store = useMenu()
      store.onSelectedKeys(['admin-projects'])

    const token = localStorage.getItem('accessToken')
    const axiosStore = useAxiosStore()

    if (token) {
      axiosStore.initializeAxios(token)
    }

    const router = useRouter()
    const projectId = router.currentRoute.value.params.id // Assuming the project ID is passed as route parameter

    const obj = null // Trạng thái ban đầu
    var ge // Biến lưu GanttMaster
    const TaskOrigin = []

    const ret = reactive({
      tasks: [],
      resources: [],
      roles: [],
      version: '',
      project_id: projectId,
      selectedRow: 2,
      deletedTaskIds: [],
      canWrite: true, // Xác định người dùng có quyền chỉnh sửa thông tin dự án không
      canDelete: true, // Xác định người dùng có quyền xóa thông tin không
      canWriteOnParent: true, // Người dùng có quyền chỉnh sửa task cha không
      canAdd: true, // Người dùng có quyền thêm task mới không
    })

    // Hàm khởi tạo Gantt
    const initGantt = async () => {
      try {
        // Tải Gantt scripts
        await loadGanttScripts()
      } catch (error) {
        console.error('Lỗi khi tải Gantt scripts hoặc file ngôn ngữ:', error)
        return // Dừng thực thi nếu không tải được
      }

      // Tiếp tục với khởi tạo Gantt
      var canWrite = true
      var gantt = new GanttMaster()
      ge = gantt
      gantt.set100OnClose = true
      gantt.shrinkParent = true
      gantt.init($('#workSpace'))

      await loadI18n() // Chỉ tải nếu các script đã thành công
      delete gantt.gantt.zoom

      const project = await loadGanttFromServer()
      if (!project.canWrite) {
        $('.ganttButtonBar button.requireWrite').attr('disabled', 'true')
      }

      gantt.loadProject(project)
      gantt.checkpoint()
      // initializeHistoryManagement(ge.tasks[0].id)
    }

    // Hàm tải dữ liệu Gantt từ server hoặc localStorage
    const loadGanttFromServer = async () => {
      let data = await loadFromLocalStorage()
      if (!data || !data.tasks || data.tasks.length === 0) {
        data = await getDemoProject()
      }
      return data
    }

    // Hàm tải dữ liệu từ localStorage
    const loadFromLocalStorage = async () => {
      let data = null
      if (localStorage) {
        const savedData = localStorage.getItem('teamworkGantDemo')
        if (savedData) {
          data = JSON.parse(savedData)
        }
      }
      return data
    }

    // Hàm tạo dữ liệu demo từ server
      const getDemoProject = () => {
          return new Promise(async (resolve) => {
              try {
                  const response = await axiosStore.axiosInstance.get(
                      `/v2/tasks/${projectId}`,
                      {
                          headers: {
                              'Content-Type': 'application/json',
                              'Accept': 'application/json',
                          },
                      }
                  );
                  console.log('Dữ liệu trả về:', response);

                  // Kiểm tra nếu có task trong dữ liệu trả về
                  if (response.data.tasks && response.data.tasks.tasks.length > 0) {
                      // Gán dữ liệu từ API vào `ret`
                      ret.tasks = response.data.tasks.tasks;
                      TaskOrigin.push(response.data.tasks.tasks);
                      console.log('TaskOrigin:', TaskOrigin); // Gán lại task cho TaskOrigin

                      ret.resources = response.data.resources;
                      ret.roles = response.data.roles;
                      ret.version = response.data.version;

                      // Cập nhật thời gian
                      const offset = new Date().getTime() - ret.tasks[0]?.start;
                      ret.tasks.forEach((task) => {
                          if (task.start) {
                              task.start += offset;
                          }
                      });
                      resolve(ret);
                  } else {
                      // Nếu không có task, thông báo "Chưa tồn tại task"
                      message.error('Chưa tồn tại task!');
                      resolve(false);
                  }
              } catch (error) {
                  message.error('Lấy dữ liệu thất bại!');
                  console.error('Có lỗi khi gọi API:', error);
                  resolve(false);
              }
          });
      };


      // Tải đa ngôn ngữ từ function loadI18n
    const loadI18n = () => {
      GanttMaster.messages = {
        CANNOT_WRITE: 'Không có quyền thay đổi công việc sau:',
        CHANGE_OUT_OF_SCOPE:
          'Cập nhật dự án không thể thực hiện vì bạn không có quyền cập nhật dự án cha.',
        START_IS_MILESTONE: 'Ngày bắt đầu là cột mốc.',
        END_IS_MILESTONE: 'Ngày kết thúc là cột mốc.',
        TASK_HAS_CONSTRAINTS: 'Công việc có các ràng buộc.',
        GANTT_ERROR_DEPENDS_ON_OPEN_TASK:
          'Lỗi: có sự phụ thuộc vào công việc đang mở.',
        GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK:
          'Lỗi: do là hậu duệ của công việc đã đóng.',
        TASK_HAS_EXTERNAL_DEPS: 'Công việc này có sự phụ thuộc bên ngoài.',
        GANNT_ERROR_LOADING_DATA_TASK_REMOVED:
          'Lỗi khi tải dữ liệu. Công việc đã bị xóa.',
        CIRCULAR_REFERENCE: 'Tham chiếu vòng.',
        CANNOT_DEPENDS_ON_ANCESTORS: 'Không thể phụ thuộc vào tổ tiên.',
        INVALID_DATE_FORMAT:
          'Dữ liệu nhập vào không hợp lệ với định dạng trường.',
        GANTT_ERROR_LOADING_DATA_TASK_REMOVED:
          'Đã xảy ra lỗi khi tải dữ liệu. Công việc đã bị xóa.',
        CANNOT_CLOSE_TASK_IF_OPEN_ISSUE:
          'Không thể đóng công việc có vấn đề mở',
        TASK_MOVE_INCONSISTENT_LEVEL:
          'Bạn không thể di chuyển các công việc có độ sâu khác nhau.',
        CANNOT_MOVE_TASK: 'Không thể di chuyển công việc.',
        PLEASE_SAVE_PROJECT: 'Vui lòng lưu dự án.',
        GANTT_SEMESTER: 'Học kỳ',
        GANTT_SEMESTER_SHORT: 'h.',
        GANTT_QUARTER: 'Quý',
        GANTT_QUARTER_SHORT: 'q.',
        GANTT_WEEK: 'Tuần',
        GANTT_WEEK_SHORT: 't.',
      }
    }
    // Hàm tải các thư viện Gantt
    const scripts = [
      // Thư viện cơ bản
      'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
      'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',

      // Các plugin jQuery thêm
      'src/assets/gantt/libs/jquery/jquery.livequery.1.1.1.min.js',
      'src/assets/gantt/libs/jquery/jquery.timers.js',

      // Thư viện hỗ trợ
      'src/assets/gantt/libs/utilities.js',
      'src/assets/gantt/libs/forms.js',
      'src/assets/gantt/libs/date.js',
      'src/assets/gantt/libs/dialogs.js',
      'src/assets/gantt/libs/layout.js',
      'src/assets/gantt/libs/i18nJs.js',
      'src/assets/gantt/libs/jquery/dateField/jquery.dateField.js',
      'src/assets/gantt/libs/jquery/JST/jquery.JST.js',
      'src/assets/gantt/libs/jquery/valueSlider/jquery.mb.slider.js',
      'src/assets/gantt/libs/jquery/svg/jquery.svg.min.js',
      'src/assets/gantt/libs/jquery/svg/jquery.svgdom.1.8.js',

      // Thư viện Gantt chính
      'src/assets/gantt/ganttUtilities.js',
      'src/assets/gantt/ganttTask.js',
      // '/gantt/ganttDrawerSVG.js',
      'src/assets/gantt/ganttDrawerSVG.js',
      'src/assets/gantt/ganttZoom.js',
      'src/assets/gantt/ganttGridEditor.js',
      'src/assets/gantt/ganttMaster.js',
      'src/assets/gantt/diff_match_patch.js',
    ]

    const loadGanttScripts = async () => {
      for (const script of scripts) {
        try {
          await loadScript(script) // Tải từng script
        } catch (error) {
          console.error(`Lỗi tải script: ${script}`, error)
        }
      }
      console.log('Tất cả các scripts đã được xử lý!')
    }
    const unloadGanttScripts = async () => {
      for (const script of scripts) {
        try {
          await unloadScript(script) // hủy từng script
        } catch (error) {
          console.error(`hủy script: ${script}`, error)
        }
      }
      console.log('Tất cả các scripts đã được hủy xử lý!')
    }

    const download = (data, filename, type) => {
      var file = new Blob([data], { type: type })
      if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename)
      else {
        // Others
        var a = document.createElement('a'),
          url = URL.createObjectURL(file)
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        setTimeout(function () {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }, 0)
      }
    }

    const saveGanttOnServer = async () => {

      // Dòng mã này được chú thích lại, có thể là để lưu trữ dự án vào Local Storage của trình duyệt.
      // Nếu cần, bạn có thể kích hoạt lại đoạn mã này để lưu dự án vào Local Storage, ví dụ như:
      // saveInLocalStorage();
      // Lưu dự án bằng phương thức 'saveProject' của đối tượng 'ge'.
      // Dữ liệu của dự án (bao gồm các nhiệm vụ, mốc thời gian, tài nguyên, v.v.) sẽ được lưu trữ trong đối tượng 'prj'.
      var taskSave = ge.saveProject()
      // Chuyển đối tượng 'prj' thành chuỗi JSON để có thể lưu vào file hoặc gửi đi.
      // Phương thức JSON.stringify(prj, null, '\t') sẽ chuyển đổi đối tượng 'prj' thành chuỗi JSON với
      // việc căn lề đẹp (indentation) bằng tab ('\t') để dễ đọc khi xem.
      // Dữ liệu JSON này sẽ được tải xuống dưới dạng một file có tên "MyProject.json".
      // download(
      //   JSON.stringify(taskSave, null, '\t'),
      //   'MyProject.json',
      //   'application/json'
      // )

      // Điều này có thể làm sạch các dữ liệu tài nguyên không cần thiết trước khi gửi dữ liệu lên máy chủ.
      delete taskSave.canAdd

      // Xóa thuộc tính 'roles' khỏi đối tượng 'prj'.
      // Điều này giúp loại bỏ thông tin về vai trò nếu không cần thiết khi lưu trữ hoặc gửi lên máy chủ.
      delete taskSave.canWrite
      delete taskSave.canWriteOnParent
      delete taskSave.changesReasonWhy
      delete taskSave.deletedTaskIds
      delete taskSave.selectedRow
      delete taskSave.zoom
      delete taskSave.resources
      delete taskSave.roles

      // Kiểm tra nếu có nhiệm vụ nào đã bị xóa (mảng 'ge.deletedTaskIds' có độ dài lớn hơn 0).
      // Nếu có nhiệm vụ bị xóa, hiển thị hộp thoại xác nhận yêu cầu người dùng xác nhận lại trước khi tiếp tục lưu.
      if (ge.deletedTaskIds.length > 0) {
        // Hiển thị hộp thoại xác nhận, thông báo cho người dùng số lượng nhiệm vụ bị xóa.
        // Nếu người dùng chọn "Cancel", sẽ dừng hàm và không tiếp tục lưu dự án.
        if (
          !confirm(
            'Bạn có chắc chắn xóa ' +
              ge.deletedTaskIds.length +
              ' Nhiệm vụ không?'
          )
        ) {
          return
        }
      }

      // Kiểm tra và chuyển đổi TaskOrigin và taskSave thành chuỗi
      //const oldText = JSON.stringify(TaskOrigin[0])
      //const newText = JSON.stringify(taskSave.tasks)

      // Gọi hàm diffTaskText
      //const tasksave = diffTaskText(oldText, newText)

      // Gửi yêu cầu POST bằng Axios
      const response = await axiosStore.axiosInstance.post('/v2/tasks/store', {
        id: ret.project_id,
        version: ret.version,
        tasks: taskSave.tasks,
        headers: {
          'Content-Type': 'application/json', // Đảm bảo bạn đang gửi dữ liệu dưới dạng JSON
          'Accept': 'application/json', // Đảm bảo bạn nhận dữ liệu dưới dạng JSON
        },
      })
      // Kiểm tra nếu phản hồi thành công
      if (response.data.ok) {
        window.location.reload() // Reload lại trang
      } else {
        // Xử lý lỗi nếu không thành công
        let errMsg = 'Errors saving project\n'

        if (response.data.message) {
          errMsg += response.data.message + '\n' // Thêm thông báo lỗi
        }

        if (response.data.errorMessages && response.data.errorMessages.length) {
          errMsg += response.data.errorMessages.join('\n') // Gộp các lỗi chi tiết
        }

        alert(errMsg) // Hiển thị thông báo lỗi
      }
    }

    const editResources = () => {
      //make resource editor
      var resourceEditor = $.JST.createFromTemplate({}, 'RESOURCE_EDITOR')
      var resTbl = resourceEditor.find('#resourcesTable')

      for (var i = 0; i < ge.resources.length; i++) {
        var res = ge.resources[i]
        resTbl.append($.JST.createFromTemplate(res, 'RESOURCE_ROW'))
      }

      //bind add resource
      resourceEditor.find('#addResource').click(function () {
        resTbl.append(
          $.JST.createFromTemplate(
            { id: 'new', name: 'resource' },
            'RESOURCE_ROW'
          )
        )
      })

      //bind save event
      resourceEditor.find('#resSaveButton').click(function () {
        var newRes = []
        //find for deleted res
        for (var i = 0; i < ge.resources.length; i++) {
          var res = ge.resources[i]
          var row = resourceEditor.find('[resId=' + res.id + ']')
          if (row.length > 0) {
            //if still there save it
            var name = row.find('input[name]').val()
            if (name && name != '') res.name = name
            newRes.push(res)
          } else {
            //remove assignments
            for (var j = 0; j < ge.tasks.length; j++) {
              var task = ge.tasks[j]
              var newAss = []
              for (var k = 0; k < task.assigs.length; k++) {
                var ass = task.assigs[k]
                if (ass.resourceId != res.id) newAss.push(ass)
              }
              task.assigs = newAss
            }
          }
        }

        //loop on new rows
        var cnt = 0
        resourceEditor.find('[resId=new]').each(function () {
          cnt++
          var row = $(this)
          var name = row.find('input[name]').val()
          if (name && name != '')
            newRes.push(
              new Resource('tmp_' + new Date().getTime() + '_' + cnt, name)
            )
        })

        ge.resources = newRes

        closeBlackPopup()
        ge.redraw()
      })

      var ndo = createModalPopup(400, 500).append(resourceEditor)
    }

      const initializeHistoryManagement = (taskId) => {

          //retrieve from server the list of history points in millisecond that represent the instant when the data has been recorded
          //response: {ok:true, historyPoints: [1498168800000, 1498600800000, 1498687200000, 1501538400000, …]}
          $.getJSON(contextPath + '/applications/teamwork/task/taskAjaxController.jsp', {
              CM: 'GETGANTTHISTPOINTS',
              OBJID: taskId
          }, function(response) {

              //if there are history points
              if (response.ok == true && response.historyPoints && response.historyPoints.length > 0) {

                  //add show slider button on button bar
                  var histBtn = $('<button>').addClass('button textual icon lreq30 lreqLabel').attr('title', 'SHOW_HISTORY').append('<span class="teamworkIcon">&#x60;</span>')

                  //clicking it
                  histBtn.click(function() {
                      var el = $(this)
                      var ganttButtons = $('.ganttButtonBar .buttons')

                      //is it already on?
                      if (!ge.element.is('.historyOn')) {
                          ge.element.addClass('historyOn')
                          ganttButtons.find('.requireCanWrite').hide()

                          //load the history points from server again
                          showSavingMessage()
                          $.getJSON(contextPath + '/applications/teamwork/task/taskAjaxController.jsp', {
                              CM: 'GETGANTTHISTPOINTS',
                              OBJID: ge.tasks[0].id
                          }, function(response) {
                              jsonResponseHandling(response)
                              hideSavingMessage()
                              if (response.ok == true) {
                                  var dh = response.historyPoints
                                  if (dh && dh.length > 0) {
                                      //si crea il div per lo slider
                                      var sliderDiv = $('<div>').prop('id', 'slider').addClass('lreq30 lreqHide').css({
                                          'display': 'inline-block',
                                          'width': '500px'
                                      })
                                      ganttButtons.append(sliderDiv)

                                      var minVal = 0
                                      var maxVal = dh.length - 1

                                      $('#slider').show().mbSlider({
                                          rangeColor: '#2f97c6',
                                          minVal: minVal,
                                          maxVal: maxVal,
                                          startAt: maxVal,
                                          showVal: false,
                                          grid: 1,
                                          formatValue: function(val) {
                                              return new Date(dh[val]).format()
                                          },
                                          onSlideLoad: function(obj) {
                                              this.onStop(obj)

                                          },
                                          onStart: function(obj) {
                                          },
                                          onStop: function(obj) {
                                              var val = $(obj).mbgetVal()
                                              showSavingMessage()
                                              /**
                                               * load the data history for that milliseconf from server
                                               * response in this format {ok: true, baselines: {...}}
                                               *
                                               * baselines: {61707: {duration:1,endDate:1550271599998,id:61707,progress:40,startDate:1550185200000,status:"STATUS_WAITING",taskId:"3055"},
                                               *            {taskId:{duration:in days,endDate:in millis,id:history record id,progress:in percent,startDate:in millis,status:task status,taskId:"3055"}....}}                     */

                                              $.getJSON(contextPath + '/applications/teamwork/task/taskAjaxController.jsp', {
                                                  CM: 'GETGANTTHISTORYAT',
                                                  OBJID: ge.tasks[0].id,
                                                  millis: dh[val]
                                              }, function(response) {
                                                  jsonResponseHandling(response)
                                                  hideSavingMessage()
                                                  if (response.ok) {
                                                      ge.baselines = response.baselines
                                                      ge.showBaselines = true
                                                      ge.baselineMillis = dh[val]
                                                      ge.redraw()
                                                  }
                                              })

                                          },
                                          onSlide: function(obj) {
                                              clearTimeout(obj.renderHistory)
                                              var self = this
                                              obj.renderHistory = setTimeout(function() {
                                                  self.onStop(obj)
                                              }, 200)

                                          }
                                      })
                                  }
                              }
                          })


                          // closing the history
                      } else {
                          //remove the slider
                          $('#slider').remove()
                          ge.element.removeClass('historyOn')
                          if (ge.permissions.canWrite)
                              ganttButtons.find('.requireCanWrite').show()

                          ge.showBaselines = false
                          ge.baselineMillis = undefined
                          ge.redraw()
                      }

                  })
                  $('#saveGanttButton').before(histBtn)
              }
          })
      }

      const showBaselineInfo = (event, element) => {
      alert(element.attr('data-label'))
      $(element).showBalloon(event, $(element).attr('data-label'))
      ge.splitter.secondBox.one('scroll', function () {
        $(element).hideBalloon()
      })
    }
    const newProject = () => {
      clearGantt()
    }

    const clearGantt = () => {
      if (ge) {
        // Kiểm tra nếu ge tồn tại
        ge.reset()
      } else {
        console.error('ge Chưa được khởi tạo')
      }
    }

    const saveToLocalStorage = () => {
      if (localStorage) {
        localStorage.setItem('teamworkGantDemo', JSON.stringify(project.value))
        alert('Project đã được lưu!')
      }
    }

    const addSubtask = (taskId) => {

      // Tìm task theo ID và thêm một task con
      const task = this.tasks.find((t) => t.id === taskId)
      if (task) {
        // Giả sử bạn muốn thêm một task con mới vào dưới task này
        this.tasks.push({
          id: this.tasks.length + 1, // Tạo ID mới cho task con
          name: 'New Subtask',
          level: task.level + 1, // Tăng level cho task con
        })
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      // Gọi hàm getDemoProject khi component được khởi tạo
      initGantt() // Khởi tạo Gantt khi component được mount
    })

    onUnmounted(() => {
      unloadGanttScripts()
      // destroyGantt() // Làm sạch Gantt khi component bị hủy
    })

    return {
      obj,
      ret,
      getDemoProject,
      newProject,
      saveToLocalStorage,
      saveGanttOnServer,
      addSubtask,
    }
  },
}
</script>

<style>
.add-subtasks {
  cursor: pointer !important;
}
.resEdit {
  padding: 15px;
}
thầu hợp đồng triển khai bảo trì khác
.resLine {
  width: 95%;
  padding: 3px;
  margin: 5px;
  border: 1px solid #d0d0d0;
}

body {
  overflow: hidden;
}

.ganttButtonBar h1 {
  color: #000000;
  font-weight: bold;
  font-size: 28px;
  margin-left: 10px;
}

.cell-name {
    position: relative; /* Đảm bảo thẻ td có vị trí tương đối */
}

.add-subtasks {
    position: absolute; /* Đặt nút ở vị trí tuyệt đối */
    right: 5px; /* Cách bên phải thẻ td một khoảng cách (có thể điều chỉnh) */
    top: 50%; /* Đặt nút vào giữa theo chiều dọc */
    transform: translateY(-50%); /* Điều chỉnh lại vị trí cho chính giữa hoàn hảo */
}

</style>
